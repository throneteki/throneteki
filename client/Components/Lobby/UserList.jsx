import React from 'react';

import Avatar from '../Site/Avatar';

const UserList = ({ users }) => {
    if (!users) {
        return <div>Userlist loading...</div>;
    }

    const userList = users.map((user) => (
        <div className='user-row' key={user.name}>
            <Avatar username={user.name} />
            <span>{user.name}</span>
        </div>
    ));

    return (
        <div className='userlist'>
            Online Users
            {userList}
        </div>
    );
};

export default UserList;
