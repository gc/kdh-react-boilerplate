import React, { Component, Fragment } from 'react';

import { BASE_API_URL, BASE_WEB_URL, CLIENT_ID } from '../meta/constants';
import { loadState, saveState, resetState } from '../meta/util';
import history from '../meta/history';
import Header from './Header';

const oauthURL = new URL('https://discordapp.com/oauth2/authorize');
oauthURL.search = new URLSearchParams([
   ['redirect_uri', BASE_WEB_URL],
   ['response_type', 'code'],
   ['scope', ['identify', 'guilds'].join(' ')],
   ['client_id', CLIENT_ID]
]);

class Root extends Component {
   state = {
      token: loadState('token'),
      user: loadState('user'),
      application: loadState('application'),
      loading: false,
      activeGuild: null,
      newPrefix: ''
   };

   componentDidMount() {
      this.fetchApplication();
      const query = new URLSearchParams(window.location.search);
      const code = query.get('code');

      if (code) {
         this.fetchToken(code);
         history.replace('/');
      }
   }

   updateSetting = async (key, value) => {
      const response = await fetch(`${BASE_API_URL}/oauth/user/guilds`, {
         method: 'POST',
         headers: {
            Authorization: this.state.token,
            'Content-Type': 'application/json',
            accept: 'application/json'
         },
         body: JSON.stringify({
            data: { [key]: value },
            id: this.state.activeGuild
         })
      })
         .then(res => res.json())
         .then(JSON.stringify);

      let user = {
         ...this.state.user,
         guilds: [
            ...this.state.user.guilds.map(g => {
               if (g.id === this.state.activeGuild) {
                  g.settings[key] = value;
               }
               return g;
            })
         ]
      };

      this.setState({ response, newPrefix: null, user });
   };

   async fetchApplication() {
      const application = await fetch(`${BASE_API_URL}/application`).then(res => res.json());

      saveState('application', application);
      this.setState({ application });
   }

   async fetchToken(code) {
      this.setState({ loading: true });
      const { access_token, user } = await fetch(`${BASE_API_URL}/oauth/callback`, {
         method: 'post',
         body: JSON.stringify({ code, redirectUri: BASE_WEB_URL })
      }).then(res => res.json());

      user.guilds = user.guilds.filter(g => g.userCanManage);
      saveState('token', access_token);
      saveState('user', user);
      this.setState({ token: access_token, user, loading: false });
   }

   logOut = () => {
      this.setState({ token: undefined, user: undefined });
      resetState();
      history.replace('/');
   };

   render() {
      const { user, token, application, activeGuild, loading, newPrefix } = this.state;

      if (loading) {
         return (
            <div style={{ margin: 50 }}>
               <p>Loading...</p>
            </div>
         );
      }

      if (!user || !token) {
         return (
            <div style={{ margin: 50 }}>
               <a href={oauthURL}>Login</a>
            </div>
         );
      }

      const guild = user.guilds.find(g => g.id === activeGuild);

      return (
         <div style={{ margin: 50 }}>
            <Header user={user} app={application} logOut={this.logOut} />

            {!!activeGuild && (
               <Fragment>
                  <h1>Selected Guild</h1>
                  <div
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'flex-start',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                     }}>
                     <h3>{guild.name}</h3>
                     <div>
                        <input
                           onChange={({ target }) =>
                              this.setState({ newPrefix: target.value })
                           }
                           type="text"
                           value={newPrefix}
                        />
                        <button onClick={() => this.updateSetting('prefix', newPrefix)}>
                           Set Prefix
                        </button>
                        {this.state.response}
                     </div>
                     <li>{guild.memberCount} Members</li>
                     <li>
                        Prefix: <code>{guild.settings.prefix}</code>
                     </li>
                     <div style={{ width: '25%' }}>
                        {guild.emojis.map(e => (
                           <img
                              alt="Emoji"
                              height="20"
                              src={`https://cdn.discordapp.com/emojis/${e}.png`}
                           />
                        ))}
                     </div>
                  </div>
               </Fragment>
            )}

            <h1>Guilds I'm in</h1>
            <div style={{ flexWrap: 'wrap', display: 'flex', flexDirection: 'row' }}>
               {user.guilds
                  .filter(g => g.channels)
                  .map(g => (
                     <img
                        key={g.id}
                        onClick={() => this.setState({ activeGuild: g.id })}
                        alt={g.name}
                        src={g.iconURL || 'https://cdn.discordapp.com/embed/avatars/1.png'}
                        height="50"
                        style={{ borderRadius: '50%', margin: 20, cursor: 'pointer' }}
                     />
                  ))}
            </div>

            <h1>Guilds I'm Not In</h1>
            <div style={{ flexWrap: 'wrap', display: 'flex', flexDirection: 'row' }}>
               {user.guilds
                  .filter(g => !g.channels)
                  .map(g => (
                     <img
                        key={g.id}
                        alt={g.name}
                        src={g.iconURL || 'https://cdn.discordapp.com/embed/avatars/1.png'}
                        height="50"
                        style={{ borderRadius: '50%', margin: 20 }}
                     />
                  ))}
            </div>
         </div>
      );
   }
}

export default Root;
