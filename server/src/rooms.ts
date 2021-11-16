export type User = {
    id: string,
    name: string,
    owner?: boolean
}

export type Room = {
    code: string,
    owner: User,
    mode: number,
    users: User[]
}

const rooms: Room[] = [];

export function createRoom(code: string, owner: User) {
    if(getRoom(code))
        return { error: 'Room already exists' };
        
    owner.owner = true
    const newRoom: Room = {code, owner, mode: 0, users: [owner]};
    rooms.push(newRoom);
    return newRoom;
}

export function removeRoom(code: string) {
    const roomIndex = rooms.findIndex((room) => room.code == code)

    if(roomIndex == -1)
        return { error: 'Room doesn\'t exist'};
    
    // Removes and returns the removed room
    return rooms.splice(roomIndex, 1)[0];
    
}

export function addUser(room: Room | string, user: User) {
    if(typeof room == 'string')
        room = getRoom(room)!;
    if(!room) return { error: 'Room doesn\'t exist'}

    //TODO: User already exists

    room.users.push(user)

    return room;
}

export function removeUser(room: Room | string, user: User | string) {
    if(typeof room == 'string')
        room = getRoom(room)!;
    if(!room) return { error: 'Room doesn\'t exist'}

    if(typeof user == 'string')
        user = getUser(user)!;
    if(!user) return { error: 'User doesn\'t exist'}

    const userIndex = room.users.findIndex(u => u == user)

    if(userIndex == -1)
        return { error: 'Room doesn\'t exist'};
    
    // if owner leaves it changes to someone else, but if there is no one it deletes the room
    if(user == room.owner) {
        if(room.users.length > 1){
            room.owner = room.users[userIndex + 1];
            room.users[userIndex + 1].owner = true;
        }else
            return removeRoom(room.code)   
    }
    
    // Removes and returns the removed user
    return room.users.splice(userIndex, 1)[0];
}

export const getUserRoom = (userId: string): Room | undefined => rooms.find(room => room.users.some(user => user.id == userId))

export const getUser = (userId: string) => getUserRoom(userId)
    ?.users.find(user => user.id == userId);

export const getRoom = (code: string) => rooms.find(room => room.code == code);

// export const getUsersInRoom = (code: string) => getRoom(code)?.users