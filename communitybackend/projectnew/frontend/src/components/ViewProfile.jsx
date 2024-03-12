import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ViewProfile = () => {

  const [data, setData] = useState([])
  const getData = () => {
    axios.get("http://127.0.0.1:8000/viewprofile/")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }
  useEffect(() => { getData(); }, [])
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <table className="table table-dark table-hover">
              <tbody>
                <React.Fragment>
                  <tr>
                    <td>First Name</td>
                    <td>{data.first_name}</td>
                  </tr>
                  <tr>
                    <td>Last Name</td>
                    <td>{data.last_name}</td>
                  </tr>
                  <tr>
                    <td>Phone No</td>
                    <td>{data.phone}</td>
                  </tr>
                  <tr>
                    <td>Email ID</td>
                    <td>{data.email}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{data.address}</td>
                  </tr>
                  <tr>
                    <td>Skills</td>
                    <td>{data.skills}</td>
                  </tr>
                  <tr>
                    <td>Interests</td>
                    <td>{data.interest}</td>
                  </tr>
                </React.Fragment>
              </tbody>

            </table>
            <button type="submit" onClick="/editprofile" className="btn btn-primary">Edit</button>
          </div>

        </div>
      </div>
    </div >
  )
}

export default ViewProfile