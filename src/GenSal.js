import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/gensal.css'; 

function GenSal() {
  const [allUsers, setAllUsers] = useState([]);
  const [allsal, setAllSal] = useState([]);
  const [formValues, setFormValues] = useState({
    id: '',
    s_eid: '',
    g_sal: '',
    t_sal: '',
    sal_amt: '',
  });

  const navigate = useNavigate();
  const logout = async () => {
    const confirmlogout = window.confirm(`Are you sure do you want to logout??`);
    if (!confirmlogout) {
      return;
    }
    navigate('/');
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8001/allEmps');
        setAllUsers(res.data);

        setAllSal(res.data);
      } catch (error) {
        console.error('Error fetching emps:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8001/allSalary');
        setAllSal(res.data);
      } catch (error) {
        console.error('Error fetching emps:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  useEffect(() => {
    const calculateTotalSalary = () => {
      const grossSalary = parseFloat(formValues.g_sal) || 0;
      const tax = parseFloat(formValues.t_sal) || 0;
      return grossSalary - tax;
    };
  
    const totalSalary = calculateTotalSalary();
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      sal_amt: totalSalary,
    }));
  }, [formValues.g_sal, formValues.t_sal]);
  
  const handleDeleteClick = async (user) => {
    const confirmDelete = window.confirm(`Delete Salary id ${user.id}?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:8001/deleteSalary/${user.id}`);
      console.log('Employee deleted successfully:', res.data);

      const updatedData = await axios.get('http://localhost:8001/allSalary');
      setAllSal(updatedData.data);
    } catch (error) {
    }
  };
  const [activeTable, setActiveTable] = useState('Form');
  useEffect(() => {
    // Generate a random Employee ID when the component loads
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      id: generateRandomString(8), // Change the length as needed
    }));
  }, []);
  const generateRandomString = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8001/Salary', formValues)
      .then(async(result) => {
        console.log(result);
        setFormValues({
          id:generateRandomString(8),
          g_sal:"",
          t_sal:"",
          sal_amt:"",
          s_eid:""
        })
        setActiveTable('Table');
        const res = await axios.get('http://localhost:8001/allSalary');
        setAllSal(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          if (err.response.data.error === "EmpID"){
            alert('Employee Id already exists');
          }
          else{
            alert('Salary Id already exists');
          }
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className='gensal'>
      <div className='nav'>
      <a href="/Home" title='Home Page'>Home</a>
      <a href="/Emp" title='Create Employee Page'>Add Employee</a>
      <a href="/AllEmp" title='Employees Page'>All Employees</a>
      <a href="/Admin" title='Create Admin Page'>Add Admin</a>
      <a href="/AllAdmin" title='Admins Page'>All Admins</a>
      <a href="/GenSal" title='Genrate Salary Page' className='active'>Genrate Salary</a>
      <a href="/LeaReq" title='Leave Page'>Leaves Info</a>
      <a href="#" onClick={() => logout()} title='Sign Out'>Sign Out</a>
    </div>
    <div className="side">
      <div className="salbar">
        <button onClick={() => setActiveTable('Form')}  className={activeTable === 'Form' ? 'activeside' : ''}>Genrate Salary</button>
        <button onClick={() => setActiveTable('Table')}  className={activeTable === 'Table' ? 'activeside' : ''}>Salary Records</button>
      </div>
    {activeTable === 'Form' && (
      <div className="formside">
        <div title='Coin' className="coin">₹</div>
      <form method='post' action='' onSubmit={handleSubmit}>
        <table>
          <tr>
            <td align='right'>Salary ID :</td>
            <td>
              <input 
                onChange={handleInputChange}
                value={formValues.id}
                required
                type='text'
                name='id'
                placeholder='Enter ID'
              />
            </td>
          </tr>
          <tr>
            <td align='right'>Employee Name :</td>
            <td>
              <select
                name='s_eid'
                required
                onChange={handleInputChange}
                value={formValues.s_eid}
              >
                <option value=''>Choose Employee</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td align='right'>Gross Salary :</td>
            <td>
              <input
                onChange={handleInputChange}
                value={formValues.g_sal}
                required
                type='number'
                name='g_sal'
                placeholder='Gross Salary'
              />
            </td>
          </tr>
          <tr>
            <td align='right'>Salary Tax :</td>
            <td>
              <input
                onChange={handleInputChange}
                value={formValues.t_sal}
                required
                type='number'
                name='t_sal'
                placeholder='Salary Tax'
              />
            </td>
          </tr>
          <tr>
            <td align='right'>Total Salary :</td>
            <td>
              <input
                disabled
                value={formValues.sal_amt}
                required
                type='number'
                name='sal_amt'
                placeholder='Total Salary'
              />
            </td>
          </tr>
        </table>
        <div className="btnsub">
          <button>Genrate</button>
        </div>
      </form>
      </div>
    )}

      <br/>
      {activeTable === 'Table' && (
        <div className="tableside">
      <table>
        <tr>
          <th>Salary Id</th>
          <th>Employee Id</th>
          <th>Gross Salary</th>
          <th>Salary Tax</th>
          <th>Total Salary</th>
          <th>Action</th>
        </tr>
        {allsal.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.s_eid}</td>
            <td>{user.g_sal}</td>
            <td>{user.t_sal}</td>
            <td>{user.sal_amt}</td>
            <td><button onClick={() => handleDeleteClick(user)}>🗑️</button></td>
          </tr>
        ))}
      </table>
      </div>
      )}
      </div>
    </div>
  );
}

export default GenSal;
