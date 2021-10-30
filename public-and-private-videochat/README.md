# Agora Recorder sample

Recorder for public and private video chats with Agora.io stream service.

Target file has resolution 320×240 for public video chats and 640×240 (side by side mixing layout).

## Prerequisites
- Agora Account
- Ubuntu 12.04+ x64 or CentOS 6.5+ x64 (CentOS 7+ recommended)
- GCC 4.4+
- ARS IP (public IP)
- 1MB+ bandwidth for each simultaneous recording channel
- Server access for `qos.agoralab.co`
- NodeJS 14+

  **Note:** If server access is denied, the Agora SDK may fail to transfer the required data.

## Quick Start

### Installation
Please check out [general documentation for samples](https://github.com/webtoucher/agora-recorder-samples).

### Using
You should name your channels like this:

- `room_owner_username` – for public chats
- `room_owner_username:guest_username` – for private chats

Run recording server with the follow command:

```bash
$ npm run start
```

### Predefined APIs
#### Start Recording

- `http://localhost:3000/recorder/v1/start`

Method:

- POST

Parameters:


|Name   |Mandatory|Type   |Desc                 |
|-------|---------|-------|---------------------|
|channel|Y        |string |channel name         |
|owner  |N        |integer|uid of the room owner|

Example:
```
curl -i -X POST -H "Content-type: application/json" --data '{"channel":"goddess:good_boy","owner":12345}' 127.0.0.1:3000/recorder/v1/start 
```

Sample Response:

```
{
    "success": true,
}
```

Response Properties:

|Name   |Type|Desc            |
|-------|----|----------------|
|success|bool|operation result|

#### Stop Recording

- `http://localhost:3000/recorder/v1/stop`

Method:

- POST

Parameters:

|Name   |Mandatory|Type  |Desc        |
|-------|---------|------|------------|
|channel|Y        |string|channel name|

Sample Response:

```
{
    "success": true
}
```

Response Properties:

|Name   |Type|Desc            |
|-------|----|----------------|
|success|bool|operation result|

## Resources
- See full API documentation in the [Document Center](https://docs.agora.io/en/)

## License
This software is licensed under the BSD 3-Clause License. [View the license](LICENSE.md).
