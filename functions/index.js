const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();
app.use(cors());

//users = patients
app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("users").get();

  let users = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    users.push({ id, ...data });
  });

  res.status(200).send(users);
});

app.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection('users').doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    res.status(200).send({id: userId, ...userData});
})

app.post("/", async (req, res) => {
  const user = req.body;

  await admin.firestore().collection("users").add(user);

  res.status(201).send();
});

app.put("/:id", async (req, res) => {
    const body = req.body;

    await admin.firestore().collection('users').doc(req.params.id).update(body);

    res.status(200).send()
});

app.delete("/:id", async (req, res) => {
    await admin.firestore().collection("users").doc(req.params.id).delete();

    res.status(200).send();
})

app.post("/login", async (req, res) => {
  const data = req.body;

  const snapshot = await admin.firestore().collection("users")
    .where("email","==",data.email)
    .where("password","==",data.password)
    .get();

  const userData = (snapshot.empty) ? {} : {id: snapshot.docs[0].id, ...snapshot.docs[0].data()};

  res.status(200).send(userData);

})

exports.user = functions.https.onRequest(app);


//appointments
const app2 = express();
app2.use(cors());

app2.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("appointments").get();

  let appointments = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    appointments.push({ id, ...data });
  });

  res.status(200).send(appointments);
});

app2.get("/user/:userId", async (req, res) => {

  const snapshot = await admin.firestore().collection('appointments').where("userId","==",req.params.userId).get();

  let appointments = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    appointments.push({ id, ...data });
  });

  res.status(200).send(appointments);

});

app2.get("/doctor/:docId", async (req, res) => {

  const snapshot = await admin.firestore().collection('appointments').where("docId","==",req.params.docId).get();

  let appointments = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    appointments.push({ id, ...data });
  });

  res.status(200).send(appointments);

});

//Get data for occupied time slot
app2.get("/doctor/:docId/:date", async (req, res) => {

  const snapshot = await admin.firestore().collection('appointments')
    .where("docId","==",req.params.docId)
    .where("date","==",req.params.date).get();

  let appointments = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    appointments.push({ id, ...data });
  });

  res.status(200).send(appointments);

});

app2.get("/doctor/getUpcomingAppointments/:docId", async (req, res) => {

  const snapshot = await admin.firestore().collection('appointments')
    .where("docId","==",req.params.docId)
    .get();

  let appointments = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    appointments.push({ id, ...data });
  });

  res.status(200).send(appointments);

});

app2.post("/addAppointment", async (req, res) => {
  const appointment = req.body;

  await admin.firestore().collection("appointments").add(appointment);

  res.status(200).send();
});

app2.put("/:id", async (req, res) => {
    const body = req.body;

    await admin.firestore().collection('appointments').doc(req.params.id).update(body);

    res.status(200).send()
});

exports.appointment = functions.https.onRequest(app2);

const app3 = express();
app3.use(cors());

app3.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("doctors").get();

  let doctors = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    doctors.push({ id, ...data });
  });

  res.status(200).send(doctors);
});

app3.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection('doctors').doc(req.params.id).get();

    const doctorId = snapshot.id;
    const doctorData = snapshot.data();

    res.status(200).send({id: doctorId, ...doctorData});
})

app3.post("/", async (req, res) => {
  const doctor = req.body;

  await admin.firestore().collection("doctors").add(doctor);

  res.status(201).send();
});

app3.put("/:id", async (req, res) => {
    const body = req.body;

    await admin.firestore().collection('doctors').doc(req.params.id).update(body);

    const snapshot = await admin.firestore().collection('doctors').doc(req.params.id).get();

    const doctorId = snapshot.id;
    const doctorData = snapshot.data();

    res.status(200).send({id: doctorId, ...doctorData});
});

app3.post("/login", async (req, res) => {
  const data = req.body;
  const snapshot = await admin.firestore().collection("doctors")
    .where("email","==",data.email)
    .where("password","==",data.password)
    .get();

  const docData = (snapshot.empty) ? {} : {id: snapshot.docs[0].id, ...snapshot.docs[0].data()};

  res.status(200).send(docData);

})

exports.doctor = functions.https.onRequest(app3);

