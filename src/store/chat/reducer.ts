import { Reducer } from 'redux';
import { IChatState, ChatActionTypes, IUser, IGroup, IContact } from './types';

const startingState: IChatState = {
  activeUser: 3,
  users: [
    {
      id: 0,
      name: 'Patrick Hendrickssss',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'online',
      unRead: 0,
      roomType: 'contact',
      isGroup: false,
      messages: [
        {
          id: 1,
          message: 'hi',
          time: '01:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'hi patrick',
          time: '10.00',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 3,
          message: 'how\'s going on your project?',
          time: '01:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 4,
          message: 'Do you need any help?',
          time: '01:06',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        { id: 33, isToday: true },
        {
          id: 5,
          message: 'Let me know?',
          time: '01:06',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 6,
          message: 'hi...Good Morning!',
          time: '09:05',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 7,
          message: 'image',
          time: '10:30',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
          ],
        },
        {
          id: 8,
          message:
            'please, save this pictures to your file and give it to me after you have done with editing!',
          time: '10:31',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 9,
          message: 'okay sure😄👍',
          time: '02:50',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },
    {
      id: 1,
      name: 'Mark Messer',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'away',
      unRead: 2,
      isGroup: false,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'hello',
          time: '10.00',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'photos',
          time: '10:30',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
          ],
        },
      ],
    },
    {
      id: 13,
      name: 'General',
      profilePicture: 'https://via.placeholder.com/100',
      unRead: 0,
      isGroup: true,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          userName: 'John Smith',
          message: 'Hello send project photos',
          time: '12:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          userName: 'Steve Walker',
          message: 'photos',
          time: '12:05',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [{ title: 'Photo', image: 'https://via.placeholder.com/100' }],
        },
        {
          id: 3,
          userName: 'admin',
          message: 'Good Afternoon everyone !',
          time: '2:05',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 4,
          userName: 'Galen Rizo',
          message: 'This theme is Awesome!',
          time: '2:06',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },

    {
      id: 4,
      name: 'Doris Brown',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'online',
      unRead: 0,
      isGroup: false,
      isTyping: true,
      messages: [
        {
          id: 1,
          userName: 'Doris Brown',
          message: 'Good Morning',
          time: '10:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          userName: 'admin',
          message: 'Good morning, How are you? What about our next meeting?',
          time: '10:02',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        { id: 33, isToday: true },
        {
          id: 3,
          message: 'Yeah everything is fine',
          time: '10:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 4,
          message: '& Next meeting tomorrow 10.00AM',
          time: '10:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 5,
          message: 'Wow that\'s great',
          time: '10:06',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 6,
          message: 'photos',
          time: '10:30',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
          ],
        },
        {
          id: 7,
          userName: 'admin',
          message: 'Files',
          time: '01:30',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: true,
          fileMessage: 'admin_v1.0.zip',
          size: '12.5 MB',
        },
        {
          id: 8,
          message: '',
          time: '10:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
          isTyping: true,
        },
      ],
    },
    {
      id: 5,
      name: 'Designer',
      profilePicture: 'https://via.placeholder.com/100',
      unRead: 1,
      isGroup: true,
      messages: [
        {
          id: 1,
          userName: 'Doris Brown',
          message: 'Hello send project photos',
          time: '12:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        { id: 33, isToday: true },
        {
          id: 2,
          userName: 'Steve Walker',
          message: 'photos',
          time: '12:05',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [{ title: 'Photo', source: 'https://via.placeholder.com/100' }],
        },
        {
          id: 3,
          userName: 'admin',
          message: 'photos',
          time: '01:30',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: true,
          fileMessage: 'Minible-Vertical.zip',
        },
        {
          id: 4,
          userName: 'admin',
          message: '@Doris Brown please review this code, and give me feedback asap',
          time: '01:31',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 5,
          userName: 'John Howard',
          message: 'Good Afternoon everyone !',
          time: '2:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 6,
          userName: 'admin',
          message: 'Good Afternoon everyone !',
          time: '2:05',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 9,
          userName: 'John Howard',
          message: 'Next meeting tomorrow 10.00AM',
          time: '2:10',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },

    {
      id: 6,
      name: 'Steve Walker',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'away',
      unRead: 0,
      isGroup: false,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'file',
          time: '01:16',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: true,
          fileMessage: 'Minible-Vertical.zip',
        },
        {
          id: 2,
          message: 'Okay 👍, let me check it and get back to you soon',
          time: '01:16',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },

    {
      id: 7,
      name: 'Albert Rodarte',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'online',
      unRead: 0,
      isGroup: false,
      isTyping: true,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'hi',
          time: '01:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'Hello, how can i help you',
          time: '01:05',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 3,
          message: '',
          time: '01:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
          isTyping: true,
        },
      ],
    },

    {
      id: 8,
      name: 'Mirta George',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'online',
      unRead: 0,
      isGroup: false,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'hi...Good Morning!',
          time: '09:05',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'image',
          time: '10:30',
          userType: 'sender',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
          ],
        },
        {
          id: 3,
          message:
            'please, save this pictures to your file and give it to me after you have done with editing!',
          time: '10:31',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 4,
          message: 'Yeah, Everything is fine👍',
          time: '02:50',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },

    {
      id: 9,
      name: 'Paul Haynes',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'away',
      unRead: 0,
      isGroup: false,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'hi...Good Morning!',
          time: '09:05',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'image',
          time: '10:30',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
            { title: 'Photo', source: 'https://via.placeholder.com/100' },
          ],
        },
        {
          id: 3,
          message:
            'please, save this pictures to your file and give it to me after you have done with editing!',
          time: '10:31',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 4,
          message: 'Good Morning😄',
          time: '02:50',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },

    {
      id: 2,
      name: 'Jonathan Miller',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'online',
      unRead: 0,
      isGroup: false,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'hello Admin',
          time: '08:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'Good morning',
          time: '08:00',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 3,
          message: 'is everything is fine ?',
          time: '08:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 4,
          message: 'i can help you😊',
          time: '08:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 5,
          message: 'Hi, How are You?',
          time: '08:00',
          userType: 'receiver',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },

    {
      id: 3,
      name: 'Ossie Wilson',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'away',
      unRead: 0,
      isGroup: false,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'hi',
          time: '12:00',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'Did you finished it?',
          time: '12:00',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'I\'ve finished it! See you so',
          time: '12:05',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [{ title: 'Photo', source: 'https://via.placeholder.com/100' }],
        },
      ],
    },

    {
      id: 14,
      name: 'Sara Muller',
      profilePicture: 'https://via.placeholder.com/100',
      status: 'offline',
      unRead: 0,
      isGroup: false,
      messages: [
        { id: 33, isToday: true },
        {
          id: 1,
          message: 'hi yana',
          time: '12:00',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
        {
          id: 2,
          message: 'image',
          time: '12:05',
          userType: 'receiver',
          isImageMessage: true,
          isFileMessage: false,
          imageMessage: [{ title: 'Photo', source: 'https://via.placeholder.com/100' }],
        },
        {
          id: 3,
          message: 'Wow that\'s great',
          time: '12:00',
          userType: 'sender',
          isImageMessage: false,
          isFileMessage: false,
        },
      ],
    },
  ] as IUser[],
  groups: [
    {
      groupId: 1,
      name: '#General',
      profilePicture: 'Null',
      isGroup: true,
      unRead: 0,
      desc: 'General Group',
      members: [
        { userId: 1, name: 'Sara Muller', profilePicture: 'Null', role: null },
        {
          userId: 2,
          name: 'Ossie Wilson',
          profilePicture: 'https://via.placeholder.com/100',
          role: 'admin',
        },
        {
          userId: 3,
          name: 'Jonathan Miller',
          profilePicture: 'Null',
          role: null,
        },
        {
          userId: 4,
          name: 'Paul Haynes',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 5,
          name: 'Yana sha',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 6,
          name: 'Steve Walker',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
      ],
    },
    {
      groupId: 2,
      name: '#Reporting',
      profilePicture: 'Null',
      isGroup: true,
      unRead: 23,
      desc: 'reporing Group here...',
      members: [
        { userId: 1, name: 'Sara Muller', profilePicture: 'Null', role: null },
        {
          userId: 2,
          name: 'Ossie Wilson',
          profilePicture: 'https://via.placeholder.com/100',
          role: 'admin',
        },
        {
          userId: 3,
          name: 'Jonathan Miller',
          profilePicture: 'Null',
          role: null,
        },
        {
          userId: 4,
          name: 'Paul Haynes',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 5,
          name: 'Yana sha',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 6,
          name: 'Steve Walker',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
      ],
    },
    {
      groupId: 3,
      name: '#Designer',
      profilePicture: 'Null',
      isGroup: true,
      unRead: 0,
      isNew: true,
      desc: 'designers Group',
      members: [
        { userId: 1, name: 'Sara Muller', profilePicture: 'Null', role: null },
        {
          userId: 2,
          name: 'Ossie Wilson',
          profilePicture: 'https://via.placeholder.com/100',
          role: 'admin',
        },
        {
          userId: 3,
          name: 'Jonathan Miller',
          profilePicture: 'Null',
          role: null,
        },
        {
          userId: 4,
          name: 'Paul Haynes',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 5,
          name: 'Yana sha',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 6,
          name: 'Steve Walker',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
      ],
    },
    {
      groupId: 4,
      name: '#Developers',
      profilePicture: 'Null',
      isGroup: true,
      unRead: 0,
      desc: 'developers Group',
      members: [
        { userId: 1, name: 'Sara Muller', profilePicture: 'Null', role: null },
        {
          userId: 2,
          name: 'Ossie Wilson',
          profilePicture: 'https://via.placeholder.com/100',
          role: 'admin',
        },
        {
          userId: 3,
          name: 'Jonathan Miller',
          profilePicture: 'Null',
          role: null,
        },
        {
          userId: 4,
          name: 'Paul Haynes',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 5,
          name: 'Yana sha',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
        {
          userId: 6,
          name: 'Steve Walker',
          profilePicture: 'https://via.placeholder.com/100',
          role: null,
        },
      ],
    },
  ] as IGroup[],
  contacts: [
    { id: 1, name: 'Albert Rodarte' },
    { id: 2, name: 'Allison Etter' },
    { id: 3, name: 'Craig Smiley' },
    { id: 4, name: 'Daniel Clay' },
    { id: 5, name: 'Doris Brown' },
    { id: 6, name: 'Iris Wells' },
    { id: 7, name: 'Juan Flakes' },
    { id: 8, name: 'John Hall' },
    { id: 9, name: 'Joy Southern' },
    { id: 10, name: 'Mary Farmer' },
    { id: 11, name: 'Mark Messer' },
    { id: 12, name: 'Michael Hinton' },
    { id: 13, name: 'Ossie Wilson' },
    { id: 14, name: 'Phillis Griffin' },
    { id: 15, name: 'Paul Haynes' },
    { id: 16, name: 'Rocky Jackson' },
    { id: 17, name: 'Sara Muller' },
    { id: 18, name: 'Simon Velez' },
    { id: 19, name: 'Steve Walker' },
    { id: 20, name: 'Hanah Mile' },
  ] as IContact[],
};

const reducer: Reducer<IChatState> = (state = startingState, action) => {
  switch (action.type) {
    case ChatActionTypes.CHAT_USER:
      return { ...state };

    case ChatActionTypes.ACTIVE_USER:
      return {
        ...state,
        activeUser: action.payload,
      };

    case ChatActionTypes.FULL_USER:
      return {
        ...state,
        users: action.payload,
      };

    case ChatActionTypes.ADD_LOGGED_USER:
      const newUser = action.payload;
      return {
        ...state,
        users: [...state.users, newUser],
      };

    case ChatActionTypes.CREATE_GROUP:
      const newGroup = action.payload;
      return {
        ...state,
        groups: [...state.groups, newGroup],
      };

    default:
      return { ...state };
  }
};

export { reducer as chatReducer };