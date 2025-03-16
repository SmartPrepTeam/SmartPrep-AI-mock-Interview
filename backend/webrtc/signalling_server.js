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
    connectedUsers[userId] = { socketId: socket.id, type: clientType };
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
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
    for (const userId in connectedUsers) {
      if (connectedUsers[userId].socketId === socket.id) {
        console.log(`User ${userId} disconnected.`);
        delete connectedUsers[userId];
        break;
      }
    }
  });

  socket.on(
    "sendIceCandidateToSignalingServer",
    ({ iceCandidate, iceUserId, didIOffer }) => {
      if (didIOffer) {
        console.log(`Received ICE candidate from ${iceUserId}:`, iceCandidate);
        // storing it in offerer iceCandidate
        const offererObj = offers.find((o) => o.offererId === iceUserId);
        offererObj.offererIceCandidates.push(iceCandidate);

        // finding socket of server
        const socketToSend = Object.values(connectedUsers).find(
          (user) => user.type === "server"
        );
        socket
          .to(socketToSend.socketId)
          .emit("iceCandidateFromClient", {
            offerer_id: iceUserId,
            ice_candidate: iceCandidate,
          });
        console.log(`iceCandidate sent from ${iceUserId} .`);
      } else {
        // iceUserId => offererId here
        const offererObj = offers.find((o) => o.offererId === iceUserId);
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
    console.log(OffererObj);
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
