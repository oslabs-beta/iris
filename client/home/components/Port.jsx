import React, { Component } from 'react';

function Port(props) {
  function handlePort(e) {
    const port = e.target.parentNode.querySelector('#portOption').value;
    const password = e.target.parentNode.querySelector('#password').value;

    if (port === '' || password === '') alert('Must Fill in All Required Input Fields');
    else if (port !== '' && password !== '') {
      const reqBody = {
        port: port,
        password: password
      };

      fetch('/port', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      })
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        if (data === port) alert(`ROOT ACCESS GRANTED`)
        else alert('Incorrect password: Your ISP has been flagged by the IRS')
      })
      .catch(err => {
        console.log('Error thrown in POST request in Port: ', err)
      })
    }
  }

  return (
    <div id='portAccess'>
      <input id='portOption' defaultValue='9090'></input>
      <input id='password' type='password'></input>
      <button id='submit' onClick={(e) => handlePort(e)}>Get ROOT ACCESS</button>
    </div>
  )
}

export default Port;