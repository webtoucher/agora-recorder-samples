# Agora Recorder samples

Sample recording applications based on the Node.js recording library for Agora.io stream service.

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
Copy any sample directory from this repository to your Linux server.

Place the `.env` file in the root of the directory with the following lines:
```dotenv
AGORA_APP_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AGORA_CERTIFICATE=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

You can get the AppID and the certificate on you [project settings page](https://console.agora.io/projects)

Installation is done using the follow command:

```bash
$ npm install
```

### Using
Please check out documentation of the sample you need.

## Resources
- See full API documentation in the [Document Center](https://docs.agora.io/en/)

## License
This software is licensed under the BSD 3-Clause License. [View the license](LICENSE.md).
