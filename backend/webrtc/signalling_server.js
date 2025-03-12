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
expressServer.listen(8181);
const connectedUsers = {
  // userId -> socketId
  // type -> server / client
};
const offers = [];
io.on("connection", (socket) => {
  socket.on("register", ({ userId, clientType }) => {
    connectedUsers[userId] = socket.id;
    connectedUsers[type] = clientType;
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
    const socketToSend = Object.values(connectedUsers).find(
      (user) => user.type === "server"
    );
    socket.to(socketToSend).emit("offer", entry);
  });

  socket.on("disconnect", () => {
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        console.log(`User ${userId} disconnected.`);
        delete connectedUsers[userId]; // Remove user on disconnect
        delete connectedUsers[type];
        break;
      }
    }
  });
  socket.on(
    "sendIceCandidateToSignalingServer",
    ({ iceCandidate, iceUserId, didIOffer }) => {
      if (didIOffer) {
        // storing it in offerer iceCandidate
        const offererObj = offers.find((o) => o.offererId === iceUserId);
        offererObj.offererIceCandidates.push(iceCandidate);

        // finding socket of server
        const socketToSend = Object.values(connectedUsers).find(
          (user) => user.type === "server"
        );
        socket.to(socketToSend).emit("iceCandidateFromClient", iceCandidate);
      } else {
        // iceUserId => offererId here
        const offererObj = offers.find((o) => o.offererId === iceUserId);
        offererObj.answererIceCandidates.push(iceCandidate);
        const socketToSend = connectedUsers[iceUserId];
        socket.to(socketToSend).emit("iceCandidateFromServer", iceCandidate);
      }
    }
  );

  socket.on("answer", (OffererObj, ackFunction) => {
    // should be sent to the react js client
    const OfferInOffers = offers.find(
      (s) => s.OffererId === OffererObj.offererId
    );
    // send already present ice candidates
    ackFunction(OfferInOffers.offererIceCandidates);
    OfferInOffers.answer = OffererObj.answer;
    const clientSocket = connectedUsers[OffererObj.offererId];
    socket.to(clientSocket).emit("AnswerFromServer", OffererObj.answer);
  });
});
