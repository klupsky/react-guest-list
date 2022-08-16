import '../App.css';
import React, { useEffect, useState } from 'react';

export default function Guestlist() {
  const baseUrl = 'https://react-guestlist-kc.herokuapp.com';
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('hi');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  // get all guests from api

  useEffect(() => {
    async function getGuestList() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setLoading(false);
      setGuestList(allGuests);
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
      setFirstName('');
      setLastName('');
      setGuestList([...guestList, createdGuest]);
    }

    await newGuest();
  };

  // delete guest from api

  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = guestList.filter((guest) => {
      return guest.id !== deletedGuest.id;
    });
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
      <br />
      <br />
      {/* INPUT */}
      <form onSubmit={(event) => handleSubmit(event)}>
        <div>Add a new guest to the list:</div>
        <label label="First name">
          <br />
          First name:
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
            disabled={loading ? true : false}
            required
          />
        </label>
        <label label="Last name">
          Last name:
          <input
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            disabled={loading ? true : false}
            required
          />
        </label>
        <button>Add guest</button>
      </form>
      <br /> <br /> <br />
      {/* OUTPUT */}
      <hr />
      {loading ? <h1>'Loading...'</h1> : ''}
      {guestList.map((guest) => (
        <div class="guest" data-test-id="guest" key={guest.id}>
          <span>{`${guest.firstName} ${guest.lastName}`}</span>
          <div>
            <input
              type="checkbox"
              class="checkbox"
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
              class="remove"
              aria-label="Remove"
              onClick={() => {
                deleteGuest(guest.id).catch(() => {});
              }}
            >
              Remove
            </button>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}