import { useState } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; /* a string is also an array */

export default function App() {
  const [word, setWord] = useState<string>('');
  const [displayWord, setDisplayWord] = useState<string>(''); /* displayword id the underscores for the word */
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [remainingGuesses, setRemainingGuesses] = useState<number>(6); /* 6 is for the amount of chances a person has to guess */

  const fetchRandomWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
      const data = await response.json();   /*this is the array for word generating*/ 
      setWord(data[0].toUpperCase());
      setDisplayWord('_ '.repeat(data[0].length)); /* this is how you know the length of the word and how many underscoreds to display */
      setUsedLetters([]);
      setRemainingGuesses(6);

    }catch (error){
      console.error('Error fetching word: ', error);
    }
  };

  const renderAlphabetButtons = () => {
    return [...ALPHABET].map((letter) => (
      <TouchableHighlight
        key={letter}
        onPress={() => handleLetterPress(letter)}
        disabled={usedLetters.includes(letter) || remainingGuesses <= 0}
      ></TouchableHighlight>
    ));
  };

  const handleLetterPress = (letter: string) => {
    if (usedLetters.includes(letter) || remainingGuesses <= 0)
      return;
    setUsedLetters([...usedLetters, letter])

    if (word.includes(letter)){
      const updatedDisplay = word.split('').map((char, index) =>
        usedLetters.includes(char) || char === letter ? char : '_ '
      ).join('');
      setDisplayWord(updatedDisplay);
    } else {
      setRemainingGuesses(remainingGuesses - 1);
    }
  };
  return (
    <View style={styles.container}>
      <Text>{displayWord || 'Press the button to start the word'}</Text> /* Press the button is similar placeholder text */
      <TouchableHighlight onPress={fetchRandomWord}>
        <Text> Start Game </Text>
      </TouchableHighlight>
    <View>
      {renderAlphabetButtons()}
    </View>
      {remainingGuesses === 0 && <Text> Game Over! The word was {word} </Text>}
      {displayWord === word && <Text> Congradulations! You guessed the word </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
