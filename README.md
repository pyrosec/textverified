# textverified

CLI tool and library to interact with the textverified API for OTPs.

## Usage

Install with

```sh
yarn global add https://github.com/pyrosec/textverified
```

Set an environment variable TEXTVERIFIED_TOKEN to the Simple Authentication token from textverified.com API set-up.

To initiate a session, use

```sh
textverified init
```

Once a session.json is generated, you can authenitcate with

```sh
textverified simple-authenticate
```

You will have to run the simple-authenticate subcommand after a certain timeout, reported by invocation of this command.

To check the list of services supported by textverified, you can use


```sh
textverified get-all-targets
```

To quickly check for the ID of a service for which you know the proper name of, it is useful to run a command similar to this one:

```sh
textverified get-all-targets -j | grep -A 5 -B 5 Google
```

Like the other tools within project ghost, adding the `-j` flag to your command will output plain JSON which can be parsed.


To get an OTP, use a command similar to:

```sh
textverified create-verification --id 33
```

This will produce a JSON object which will include the temporary phone number you should use with the target service.

Using the `get-verification` subcommand without the `--id` flag will attempt to retrieve the ID of the last pending OTP, so once you believe an OTP has been sent, you can simply use the command

```sh
textverified get-verification
```

If the OTP was successfully retrieved by textverified, it will be output with this command for your use.


## Author

pyrosec
