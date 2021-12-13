# User Schema
```
github_userId: String,
username: String,
avatar: String (URL),
token: String,
namespaces: [
  {
    type: String
  }
]
```

# Server Schema
```
endpoint: String,
img: String,
nsTitle: String,
ownerId: String,
rooms: [
  {
    roomId: String,
    roomTitle: String,
    history: [
      {
        messageId: String,
        username: String,
        date: String,
        text: String,
        avatar: String
      }
    ]
  }
]
```
