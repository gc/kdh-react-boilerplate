import React from 'react';

export default ({ user, app, logOut }) => {
   const userSection = (
      <div
         style={{
            display: 'flex',
            alignContent: 'flex-start',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap'
         }}>
         <img
            src={user.displayAvatarURL || 'https://cdn.discordapp.com/embed/avatars/1.png'}
            alt={`${user.username} Avatar`}
            style={{ borderRadius: '50%', height: 50 }}
         />
         <p>Logged in as {user.username}</p>
         <button onClick={logOut}>Log Out</button>
      </div>
   );

   const applicationSection = (
      <div
         style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'flex-start',
            justifyContent: 'space-around',
            alignItems: 'center'
         }}>
         <h3>{app.name}</h3>
         <ul>
            <li>{app.guilds} Guilds</li>
            <li>{app.users} Users</li>
         </ul>
      </div>
   );

   return (
      <div
         style={{
            display: 'flex',
            alignContent: 'flex-start',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            width: '100%',
            margin: 30
         }}>
         {userSection}
         {applicationSection}
      </div>
   );
};
