import React, { useState, useEffect } from 'react';
import Auth from '../../utils/auth';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ADD_GOAL, UPDATE_GOAL } from '../../utils/mutations';
import { QUERY_GOAL } from '../../utils/queries';
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from 'react-bootstrap/Button';

// const mongoDate = date => {
//   const year = date.getFullYear()
//   let month = date.getMonth()+1
//   let day = date.getDate()+2
 
//   if (month < 10) month = "0"+ month
//   if (day < 10) day = "0"+ day
 
//   return year + "-" + month + "-" + day
//  }
 
 
const GoalForm = () => {
    let { id: userParam } = useParams();
    const [formState, setFormState] = useState({ goalTitle: '', goalDescription: '', goalCategory: '', goalStatus: ''});


    const { loading, data } = useQuery(QUERY_GOAL, {
      variables: { id: userParam }
    });
  
    const [addGoal, { error }] = useMutation(ADD_GOAL);
    const [updateGoal] = useMutation(UPDATE_GOAL);


    useEffect(() => {
      if(!loading) {
        console.log('Goal Data: ', data.goal.dueDate);

        setFormState ({ 
            ...formState, 
            goalTitle: data.goal.goalTitle,
            goalCategory: data.goal.goalCategory,
            goalStatus: data.goal.goalStatus,
            // startDate: data.goal.startDate,
            // endDate: data.goal.endDate,
            goalDescription: data.goal.goalDescription
        });
      }
      
      
    }, [data]);


    if (loading) {
      return <div>Loading...</div>;
    }
  
    // update state based on form input changes
    const handleChange = event => {
      const { name, value } = event.target;
  
      setFormState({
        ...formState,
        [name]: value
      });
    };
  
    // submit form
    const handleFormSubmit = async event => {
      event.preventDefault();
  
      try {
        // formState.startDate= mongoDate(formState.startDate)
        // formState.dueDate= mongoDate(formState.dueDate)

        await addGoal({
          variables: { ...formState }
        });
        // window.location.replace ("/data.goal._id")
        window.location.replace ("/")

      } catch (e) {
        console.error(e);
      }

    };
    
    // submit form
    const handleFormUpdate = async () => {
      
      if (formState === "Failed") {
        return;
      }
  
      try {
        // formState.startDate= mongoDate(formState.startDate)
        // formState.dueDate= mongoDate(formState.dueDate)

       await updateGoal({
          variables: { ...formState, _id: data.goal._id }
        });
        // window.location.replace ("/data.goal._id")
       // window.location.replace ("/")

      } catch (e) {
        console.error(e);
      }

    };

    const updateStatus = async (value) => {

      setFormState({
        ...formState,
        goalStatus: value
      });

      console.log(formState);
      
      try {

          await updateGoal({
            variables: { ...formState, goalStatus: value, _id: data.goal._id }
          });
          window.location.replace (`/`)

      } catch (e) {
        console.error(e);
      }
    }

    const blocked = ['Completed', 'Failed'];

    return (
        <div className="content-wrapper">
            <div className="mb-3">
              { userParam !== "new" && !blocked.includes(formState.goalStatus) ? 
                <>
                  <Button variant="success mr-3" onClick={()=>updateStatus('Completed')} >Completed Goal!</Button>
                  <Button variant="danger" onClick={()=>updateStatus('Failed')} >I Give Up.</Button>
                </> : <></>
              }
            </div>
              
            <form >
                <label>Title:</label>
                <input
                    type="text"
                    placeholder="Goal title..."
                    name="goalTitle"
                    value={formState.goalTitle}
                    onChange={handleChange}
                    className="form-control"
                ></input>

                <label>Category:</label>
                <select
                    type="text"
                    placeholder="Category..."
                    name="goalCategory"
                    value={formState.goalCategory}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option>Select One</option>
                    <option>Financial</option>
                    <option>Nutritional</option>
                    <option>Physical</option>
                    <option>Social</option>
                    <option>Emotional</option>
                    <option>Intellectual</option>
                    <option>Career</option>
                    <option>Travel</option>
                    <option>Parenting</option>
                </select>

                <label>Status:</label>
                <select
                    type="text"
                    placeholder="Goal Status..."
                    name="goalStatus"
                    className="form-control"
                    value={formState.goalStatus}
                    onChange={handleChange}
    
                >
                    <option>Select One</option>
                    <option>Planned</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Failed</option>
                </select>
                
                {/* <label>Start Date:</label>
                <br></br>
                <DatePicker dateFormat="MM/dd/yyyy" selected={formState.startDate} onChange={date => setFormState({...formState, startDate: date})}/> */}
                {/* <input
                    type="text"
                    placeholder="Start Date..."
                    value={formState.startDate}
                    onChange={handleChange}
                    className="form-control"
                ></input> */}
                <br></br>

                {/* <label>End Date:</label>
                <br></br>
                <DatePicker dateFormat="MM/dd/yyyy" selected={formState.dueDate} onChange={date => setFormState({...formState, dueDate: date})} />
                <br></br> */}
                {/* <input
                    type="text"
                    placeholder="End Date..."
                    value={formState.dueDate}
                    onChange={handleChange}
                    className="form-control"
                ></input> */}

                <label>Description:</label>
                <textarea
                    type="text"
                    placeholder="Goal Description..."
                    name="goalDescription"
                    value={formState.goalDescription}
                    onChange={handleChange}
                    className="form-control"
                ></textarea>
                <div>
                  {userParam !== "new" ? 
                    <>
                    <button className="btn btn-default" type='submit' onClick={handleFormUpdate} >Save Changes</button>
                    </>
                  :
                    <>
                      <button className="btn btn-default" type='submit' onClick={handleFormSubmit}>Create Goal</button>
                    </>
                  }
                </div>
            </form>
        </div>
    );
};

export default GoalForm;