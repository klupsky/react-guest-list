import '../App.css';
import React, { useEffect, useState } from 'react';

export default function Guestlist() {
  const baseUrl = 'http://localhost:4000';
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('hi');
  const [lastName, setLastName] = useState('');
  // const [refetch, setRefetch] = useState(true);
  const [loading, setLoading] = useState(true);

  // get all guests from api
  // console.log('Loading...', loading);

  useEffect(() => {
    async function getGuestList() {

      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();

      setGuestList(allGuests);
      setLoading(false);
    }
    getGuestList().catch((error) => {
      console.log(error);
    });
  }, []);

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

  // delete guest from api

  function handleDeleteGuest(id) {
    async function deleteGuest() {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      console.log(deletedGuest);
    }
    deleteGuest().catch((error) => {
      console.log(error);
    });
    const newGuestList = guestList.filter((guest) => guest.id !== id);
    setGuestList(newGuestList);
  }

  // edit guest

  async function editAttendence(id, attendance) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attendance }),
    });
    const updatedGuest = await response.json();
    const newGuestList = guestList.map((guest) => {
      if (guest.id === updatedGuest.id) {
        return { ...guest, attending: updatedGuest.attending };
      }
      return guest;
    });
    setGuestList(newGuestList);
  }

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
              disabled={loading ? 'disabled' : ''}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label label="Last name">
            Last name:
            <input
              disabled={loading ? 'disabled' : ''}
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

      {/* <div>
        {loading ? (
          'Loading...'
        ) : ( */}

          <div>
          {loading ? 'Loading...' : ''}

            {guestList.map((guest) => (
              <div key={guest.id}>
                <span>{`${guest.firstName} ${guest.lastName}`}</span>

                <input
                  type="checkbox"
                  aria-label="Attending"
                  checked={guest.attending}
                  onChange={(event) => {
                    editAttendence(guest.id, event.currentTarget.checked).catch(
                      () => {},
                    );
                  }}
                />
                {guest.attending ? 'Attending' : 'Not attending'}

                <button
                  aria-label="Remove"
                  onClick={() => {
                    handleDeleteGuest(guest.id).catch(() => {});
                  }}
                >
                  Remove
                </button>

                <hr />
              </div>
            ))}
          </div>
        {/* )} */}
      </div>
    </div>
  );
}
