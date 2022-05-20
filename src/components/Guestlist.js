import '../App.css';
import { useState } from 'react';

export default function Guestlist() {
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('hi');
  const [lastName, setLastName] = useState('');
  const baseUrl = 'http://localhost:4000';

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
          attending: false,
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

  return (
    <div>
      <h2>Guestlist</h2>
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
      <div data-test-id="guest">
        <hr />
        First name: firstName
        <br />
        Second Name: Second Name
        <br />
        <input type="checkbox" aria-label="Attending" />
        not attending
        <div>
          <button aria-label="Remove Guest">Remove</button>
        </div>
        <hr />
      </div>
    </div>
  );
}
