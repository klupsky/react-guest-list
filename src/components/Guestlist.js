import '../App.css';
import React, { useEffect, useState } from 'react';

export default function Guestlist() {
  const baseUrl = 'http://localhost:4000';
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('hi');
  const [lastName, setLastName] = useState('');

  //const [loading, setLoading] = useState(true);

  // create new guest

  const handleSubmit = async (event) => {
    event.preventDefault();

    async function newGuest() {
      const response = await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
        }),
      });
      const createdGuest = await response.json();
      console.log(createdGuest);
      setFirstName('');
      setLastName('');
      setGuestList([...guestList, createdGuest]);
    }
    await newGuest();
  };

  // get guest

  useEffect(() => {
    console.log('fetching guests');

    async function getGuestList() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();

      setGuestList(allGuests);
      //    setLoading(false);
    }
    getGuestList().catch(() => {
      console.log('fetch failed');
    });
  }, []);

  // get all the guests from api

  // VISIBLE

  return (
    <div>
      <h1>Guestlist</h1>
      <br />
      {/* INPUT */}
      <form onSubmit={(event) => handleSubmit(event)}>
        <h2>Input Guests Below</h2>
        <div>
          <label label="First name">
            First name:
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label label="Last name">
            Last name:
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
        </div>
        <div>
          <button aria-label="Add Guest">Add Guest</button>
        </div>
      </form>
      <br />
      {/* OUTPUT */}
      <hr />
      <div>
        {guestList.map((guest) => {
          return (
            <div key={guest.id}>
              <table>
                <th>
                  <span>{`${guest.firstName} ${guest.lastName}`}</span>
                </th>
                <th>
                  <input type="checkbox" aria-label="Attending" />
                </th>
                <th>
                  <button aria-label="Remove">Remove</button>
                </th>
              </table>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}
