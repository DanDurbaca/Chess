# Chess

A "try" of a JS chess MVC implementation.

Goal: we are aiming to build a playable chess game in JS. This is NOT intended to be "smart" (computer playing). Instead, we are aiming to allow two people to play chess, in turns on an HTML page. What we DO intend however to implement is the correctness of the game. We would like to show the human players all possible movements as they are playing.

Implementation details: this is done in plain (vanilla) JS, HTML and CSS.

About the MVC design pattern:
M is the Model (data)
V is the View (what the user sees)
C is the Controller (the link in between the two above)

In a classical client-server architecture, the MVC can be assimilated to:
M - the database
V - the frontend (JS, HTML and CSS) - client side scripts
C - the backend (PHP) - server side scripts.

This is as well done using OOP techniques... We are building CLASSES to implement the above design pattern.

In practice:
The code starts in Main.js - that creates a ChessController object with a ChessModel and a ChessView objects as params.

Each class and its role:

ChessController - the controller of our game. This makes the link betwen the view and the model

ChessModel - the class that holds the data. This is built around a two dimensional array (the board) that holds pieces.

ChessView - this holds everything related to displaying the pieces.

ChessPieces - this is a base class for all the chess pieces. It holds basic info on each piece (position, color) as well as a link to the full board itself.

Pawn,.... - these are the classes that hold the functionality for each of the chess pieces.
