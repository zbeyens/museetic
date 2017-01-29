# Flyst.io Protocol

## Data Types
Flyst.io uses standard JavaScript DataView data types in little endian.

| Data Type | Description
|-----------|-----------
| uint8     | Unsigned 1 byte integer (byte)
| uint16    | Unsigned 2 byte integer (short)
| int16     | Signed 2 byte integer (short)
| float32   | Signed 4 byte floating point value (float)
| string    | UTF-8 string (1-4 bytes per character)
| flags     | uint8 storing 8 boolean

Each packet starts with a uint8 containing the packet ID.
The flags field is 1 byte in length, and is a bitfield

## Clientbound Packets
### Packet 1: Submit
Submit success

| Position | Data Type     | Description
|----------|---------------|-----------------
| 0        | uint8         | Packet ID
| 1        | uint16        | Player ID

### Packet 2: Clear
Reset the game

| Position | Data Type     | Description
|----------|---------------|-----------------
| 0        | uint8         | Packet ID

### Packet 10: Update Entities
Broadcast loop

| Position | Data Type        | Description
|----------|------------------|-----------------
| 0        | uint8            | Packet ID
| 1        | uint32           | Server currentTime
| 5        | uint8            | Flags main
| ?        | uint8            | Length of updatePs
| ?        | Player Data      | Data of the Players
| ?        | uint8            | Length of playersScopeRemove
| ?        | uint16           | ID of the Players to remove
| ?        | uint8            | Length of shootsScopeInit
| ?        | ShootsInit Data  | Data of the ShootsInit
| ?        | uint16           | Length of foodsScopeInit
| ?        | FoodsInit Data   | Data of the FoodsInit
| ?        | uint16           | Length of foodsScopeRemove
| ?        | uint16           | ID of the FoodsRemove
| ?        | uint16           | Length of foodsScopeEat
| ?        | FoodsEat Data    | Data of the Foods eaten
| ?        | uint8            | Length of updateBoard
| ?        | Board Data       | Data of the Board

| Flags main | Behavior
|------------|------------------
| 1 << 0     | updatePs > 0
| 1 << 1     | playersScopeRemove > 0
| 1 << 2     | shootsScopeInit > 0
| 1 << 3     | foodsScopeInit > 0
| 1 << 4     | foodsScopeRemove > 0
| 1 << 5     | foodsScopeEat > 0
| 1 << 6     | updateBoard > 0

#### Player Data
Each visible player is described by the following data.

| Offset | Data Type | Description
|--------|-----------|-------------------
| 0      | uint16    | Player ID
| 2      | uint8     | Flags player
| 3      | uint8     | Length of the nickname
| 4      | string    | Nickname
| ?      | float32   | X position
| ?      | float32   | Y position
| ?      | int16     | Angle
| ?      | uint16    | Mass

| Flags player | Behavior
|--------------|------------------
| 1 << 0       | New name
| 1 << 1       | New x
| 1 << 2       | New y
| 1 << 3       | New angle
| 1 << 4       | New mass
| 1 << 5       | Ring
| 1 << 6       | Dashing

#### ShootsInit Data
Each shoot to init is described by the following data.

| Offset | Data Type | Description
|--------|-----------|-------------------
| 0      | uint16    | id
| 2      | float32   | X position
| 6      | float32   | Y position
| 10     | uint16    | Mass
| 12     | uint16    | Lifetime

#### FoodsInit Data
Each food to init is described by the following data.

| Offset | Data Type | Description
|--------|-----------|-------------------
| 0      | uint16    | id
| 2      | float32   | X position
| 6      | float32   | Y position

#### FoodsEat Data
Each food eaten by referrerId is described by the following data.

| Offset | Data Type | Description
|--------|-----------|-------------------
| 0      | uint16    | id
| 2      | uint16    | referrerId

#### Board Data
The leaderboard is composed of string.

## Serverbound Packets
### Packet 0: Set Nickname
Sets the player's nickname.

| Position | Data Type | Description
|----------|-----------|-----------------
| 0        | uint8     | Packet ID
| 1        | string    | Nickname

### Packet 10: Input left

| Position | Data Type | Description
|----------|-----------|-----------------
| 0        | uint8     | Packet ID

### Packet 11: Input right

| Position | Data Type | Description
|----------|-----------|-----------------
| 0        | uint8     | Packet ID

### Packet 12: Input dash

| Position | Data Type | Description
|----------|-----------|-----------------
| 0        | uint8     | Packet ID
