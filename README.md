# Saraer - Ticketing system for events

[![lint and
test](https://github.com/JJ/saraer/actions/workflows/deno.yml/badge.svg)](https://github.com/JJ/saraer/actions/workflows/deno.yml)
[![Check markdown for spelling and formatting errors](https://github.com/JJ/saraer/actions/workflows/mdcheck.yml/badge.svg)](https://github.com/JJ/saraer/actions/workflows/mdcheck.yml)

Client server application for creating and reading tickets for events; a QR
gives you a ticket using some unique ID gathered from your user-agent; the new
QR can be scanned and gives you a beer, coffee, refreshment or whatever.

The objective of this system is to gather data about which talks in an event
give you more thirst, and whose unique IDs request more refreshments.

The application is created for being deployed automatically to Deno Deploy. Will
need its own deployment scripts and possibly containers to be deployed
elsewhere.

## License

(c) JJ Merelo, 2023

This application is released under the Affero GPL license. Check the
[LICENSE](LICENSE) file for more information.
