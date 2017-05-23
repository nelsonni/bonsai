class Stack {
  constructor(...cards) {
    console.log(`number of arguments: ${cards.length}`);
    for (var card of cards) {
      console.log(card);
    }
  }
}

// function Stack(...cards) {
//   console.log(`number of arguments: ${cards.length}`);
//   for (var card of cards) {
//     if (typeof card !== 'Card' && !(card instanceof Card)) {
//       alert("Type Error: The cards parameter in Stack() must be 'Card',"
//         + " is of type '" + typeof card + "' instead.");
//       return;
//     }
//     console.log(card.id);
//   }
// }
