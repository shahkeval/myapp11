import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModelEmp from './model/users.js';
import UserModelAdmin from './model/admin.js';
import UserModelSalary from './model/salary.js';
import UserModelLeave from './model/leave.js';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
const server = new ApolloServer({
  playground: true,
  introspection: true,
});
mongoose.connect('mongodb://localhost:27017/db1');

//To get all emp
app.get('/allEmps', async (req, res) => {
  try {
    const response = await UserModelEmp.find({});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To insert emp
app.post('/Emp',async (req, res) => {
  const existingUser = await UserModelEmp.findOne({ id: req.body.id });
    if (existingUser) {
      return res.status(400).json({ error: 'User ID is not available' });
    }
  UserModelEmp.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

//To delete emp
app.delete('/deleteEmp/:id', async (req, res) => {
  try {
    const empId = req.params.id;
    const deletedEmployee = await UserModelEmp.findOneAndRemove({ id: empId });
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To Update emp
app.put('/updateEmp/:id', (req, res) => {
  const { id } = req.params;
  UserModelEmp.findOneAndUpdate(
    { id: id },
    req.body,
    { new: true } 
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
    
});

//To Insert admin
app.post('/Admin',async (req, res) => {
  const existingUser = await UserModelAdmin.findOne({ id: req.body.id });
    if (existingUser) {
      return res.status(400).json({ error: 'User ID is not available' });
    }
    UserModelAdmin.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

//To get all admin
app.get('/allAdmin', async (req, res) => {
  try {
    const response = await UserModelAdmin.find({});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To delete admin
app.delete('/deleteAdmin/:id', async (req, res) => {
  try {
    const empId = req.params.id;
    const deletedEmployee = await UserModelAdmin.findOneAndRemove({ id: empId });
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting Admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To update admin
app.put('/updateAdmin/:id', (req, res) => {
  const { id } = req.params;
  UserModelAdmin.findOneAndUpdate(
    { id: id },
    req.body, 
    { new: true }
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//To insert salary
app.post('/Salary',async (req, res) => {
  const existingUser1 = await UserModelSalary.findOne({ id: req.body.id});
  const existingUser2 = await UserModelSalary.findOne({ s_eid: req.body.s_eid });
    if (existingUser1) {
      return res.status(400).json({ error: 'SalaryID' });
    }
    if (existingUser2) {
      return res.status(400).json({ error: 'EmpID' });
    }

    UserModelSalary.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

//To get all salary
app.get('/allSalary', async (req, res) => {
  try {
    const response = await UserModelSalary.find({});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To delete salary
app.delete('/deleteSalary/:id', async (req, res) => {
  try {
    const empId = req.params.id;
    const deletedEmployee = await UserModelSalary.findOneAndRemove({ id: empId });
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Salary not found' });
    }
    res.json({ message: 'Salary deleted successfully' });
  } catch (error) {
    console.error('Error deleting Salary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To login for admin
app.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminUser = await UserModelAdmin.findOne({ email, password });
    if (adminUser) {
      return res.json({ message: 'Admin authentication successful', user: adminUser });
    }
    return res.status(401).json({ message: 'Admin authentication failed' });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To login for emp
app.post('/login/employee', async (req, res) => {
  const { email, password } = req.body;
  try {
    const employeeUser = await UserModelEmp.findOne({ email, password });
    if (employeeUser) {
      return res.json({ message: 'Employee authentication successful', user: employeeUser });
    }
    return res.status(401).json({ message: 'Employee authentication failed' });
  } catch (error) {
    console.error('Error during employee login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To Get emp data only one emplyee which is login
app.get('/oneEmp/:id', async (req, res) => {
  try {
    const empId = req.params.id;
    const response = await UserModelEmp.findOne({ id: empId });
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To Get salary only one emplyee which is login
app.get('/oneSalary/:id', async (req, res) => {
  try {
    const empId = req.params.id;
    const response = await UserModelSalary.findOne({ s_eid: empId });
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To Insert leave
app.post('/leave',async (req, res) => {
  const existingUser = await UserModelLeave.findOne({ id: req.body.id });
  const existingLeave = await UserModelLeave.findOne({ eid: req.body.eid,leave_status:"pending" });
    if (existingUser) {
      return res.status(400).json({ error: 'Leave ID already exist' });
    }
    if (existingLeave) {
      return res.status(400).json({ error: 'Your Leave is alredy exist' });
    }
    UserModelLeave.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

//To get one leave leave data who is loged in
app.get('/oneLeave/:id', async (req, res) => {
  try {
    const empId = req.params.id;
    const response = await UserModelLeave.find({ eid: empId });
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To get all leave data
app.get('/allLeave', async (req, res) => {
  try {
    const response = await UserModelLeave.find({});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To get all pending leave data
app.get('/allLeaveReq', async (req, res) => {
  try {
    const response = await UserModelLeave.find({ leave_status:'pending'});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To get all rejected leave data
app.get('/allLeaveRej', async (req, res) => {
  try {
    const response = await UserModelLeave.find({ leave_status:'rejected'});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To get all approved leave data
app.get('/allLeaveApp', async (req, res) => {
  try {
    const response = await UserModelLeave.find({ leave_status:'approved'});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});

//To update status pending to approve leave in leave data
app.put('/approveLeave/:id', async (req, res) => {
  const leaveId = req.params.id;
  try {
    await UserModelLeave.findOneAndUpdate(
      { id: leaveId },
      {leave_status:'approved'}, 
      { new: true }
    )
    res.status(200).send('Leave request approved successfully');
  } catch (error) {
    console.error('Error while approving leave request:', error);
    res.status(500).send('Internal Server Error');
  }
});

//To update status pending to rejecte leave in leave data
app.put('/rejectLeave/:id', async (req, res) => {
  const leaveId = req.params.id;
  try {
    await UserModelLeave.findOneAndUpdate(
      { id: leaveId },
      {leave_status:'rejected'}, 
      { new: true }
    )
    res.status(200).send('Leave request rejected successfully');
  } catch (error) {
    console.error('Error while rejecting leave request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});