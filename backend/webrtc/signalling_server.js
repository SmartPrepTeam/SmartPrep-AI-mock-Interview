const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const app = express();
app.get("/", (req, res) => {
  res.send("hello, word!");
});
const expressServer = http.createServer(app);
const io = socketIo(expressServer, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});
expressServer.listen(8181, () => {
  console.log("Signaling server running on http://localhost:8181");
});
const connectedUsers = {
  // userId : {
  // socketId : socket.id;
  // type : server / client
  // }
};
const offers = [];
io.on("connection", (socket) => {
  socket.on("register", ({ userId, clientType }) => {
    // If user was already registered with a different socket ID, clean up old data
    if (
      connectedUsers[userId] &&
      connectedUsers[userId].socketId !== socket.id
    ) {
      console.log(`User ${userId} reconnected. Cleaning up old session.`);
      // Clean up old socket
      const oldSocketId = connectedUsers[userId].socketId;
      // Force disconnect the old socket if it still exists
      const oldSocket = io.sockets.sockets.get(oldSocketId);
      if (oldSocket) {
        console.log(`Forcing disconnection of old socket ${oldSocketId}`);
        oldSocket.disconnect(true);
      }

      // Add explicit notification to FastAPI about the reconnection
      const serverSocket = Object.values(connectedUsers).find(
        (user) => user.type === "server"
      );
      if (serverSocket) {
        socket.to(serverSocket.socketId).emit("clientReconnected", { userId });
      }
      // Remove any offers associated with this user
      const initialOffersLength = offers.length;
      for (let i = offers.length - 1; i >= 0; i--) {
        if (offers[i].offererId === userId) {
          offers.splice(i, 1);
        }
      }

      console.log(
        `Removed ${initialOffersLength - offers.length} stale offers.`
      );
    }

    // Register the user with the new socket ID
    connectedUsers[userId] = { socketId: socket.id, type: clientType };
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  socket.on("offer", ({ userId, newOffer }) => {
    const entry = {
      offer: newOffer,
      answer: null,
      offererIceCandidates: [],
      answererIceCandidates: [],
      offererId: userId,
    };
    offers.push(entry);
    console.log("Received WebRTC Offer from client");
    // finding socket of server
    const serverSocket = Object.values(connectedUsers).find(
      (user) => user.type === "server"
    );
    if (serverSocket) {
      socket.to(serverSocket.socketId).emit("offer", entry);
    }
  });

  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    let disconnectedUserType = null;
    // Find the user who disconnected
    for (const userId in connectedUsers) {
      if (connectedUsers[userId].socketId === socket.id) {
        console.log(`User ${userId} disconnected.`);
        disconnectedUserId = userId;
        disconnectedUserType = connectedUsers[userId].type;
        delete connectedUsers[userId];
        break;
      }
    }
    if (disconnectedUserId && disconnectedUserType === "server") {
      offers.forEach((offer) => {
        const clientId = offer.offererId;
        const client = connectedUsers[clientId];
        if (client) {
          io.to(client.socketId).emit("serverDisconnected");
          delete connectedUsers[clientId];
        }
      });
      offers.length = 0;
    }
    // Remove all offers made by this user
    else if (disconnectedUserId) {
      const initialOffersLength = offers.length;
      for (let i = offers.length - 1; i >= 0; i--) {
        if (offers[i].offererId === disconnectedUserId) {
          offers.splice(i, 1);
        }
      }
      console.log(
        `Removed ${
          initialOffersLength - offers.length
        } offer(s) from user ${disconnectedUserId}`
      );
    }
  });

  socket.on(
    "sendIceCandidateToSignalingServer",
    ({ iceCandidate, iceUserId, didIOffer }) => {
      console.log("inside this sendIceCandidateToSignalingServer");
      console.log("iceCandidate: ", iceCandidate);
      console.log("iceUserId: ", iceUserId);
      console.log("didIOffer: ", didIOffer);

      if (didIOffer) {
        console.log(`Received ICE candidate from ${iceUserId}:`, iceCandidate);
        // storing it in offerer iceCandidate
        const offererObj = offers.find((o) => o.offererId === iceUserId);
        offererObj.offererIceCandidates.push(iceCandidate);

        // finding socket of server
        const socketToSend = Object.values(connectedUsers).find(
          (user) => user.type === "server"
        );
        socket.to(socketToSend.socketId).emit("iceCandidateFromClient", {
          offerer_id: iceUserId,
          ice_candidate: iceCandidate,
        });
      } else {
        // iceUserId => offererId here
        const offererObj = offers.find((o) => o.offererId === iceUserId);
        if (!offererObj) return;
        console.log("pushing ice candidates: ", iceCandidate);
        offererObj.answererIceCandidates.push(iceCandidate);
        const socketToSend = connectedUsers[iceUserId];
        socket
          .to(socketToSend.socketId)
          .emit("iceCandidateFromServer", iceCandidate);
        console.log(`iceCandidate sent from server .`);
      }
    }
  );

  socket.on("answer", (OffererObj, ackFunction) => {
    console.log("answer called");
    // should be sent to the react js client
    const OfferInOffers = offers.find(
      (s) => s.offererId === OffererObj.offererId
    );
    // send already present ice candidates
    if (OfferInOffers && OfferInOffers.offererIceCandidates) {
      ackFunction(OfferInOffers.offererIceCandidates);
    } else {
      console.error(
        "OfferInOffers is undefined or does not contain offererIceCandidates:",
        OfferInOffers
      );
    }
    console.log("ack function called from node js");
    OfferInOffers.answer = OffererObj.answer;
    const clientSocket = connectedUsers[OffererObj.offererId];
    socket
      .to(clientSocket.socketId)
      .emit("AnswerFromServer", OffererObj.answer);
    console.log(
      `answer ${OffererObj.answer} sent from server to ${OffererObj.offererId}.`
    );
  });
});
