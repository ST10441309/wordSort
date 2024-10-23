import { useState } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const WelcomeScreen = ({navigation}: {navigation: any}) => {
  return(
    <View style={styles.container}>
      <Button
        title="Start the Game!"
        onPress={() => {
        navigation.navigate('Game');
      }}
      />
    </View>
  );
};

const GameScreen = ({navigation}: {navigation: any}) => {
  const [word, setWord] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [remainingGuesses, setRemainingGuesses] = useState(6);
  const [loading, setLoading] = useState(false);

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
      const data = await response.json();
      const newWord = data[0].toUpperCase();
      setWord(newWord);
      setDisplayWord('_'.repeat(newWord.length).split('').join(' '));
      setUsedLetters([]);
      setRemainingGuesses(6);
    } catch (error) {
      console.error('Error fetching word: ', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAlphabetButtons = () => {
    return (
      <View style={styles.alphabetContainer}>
        {[...ALPHABET].map((letter) => (
          <TouchableOpacity
            key={letter}
            onPress={() => handleLetterPress(letter)}
            disabled={usedLetters.includes(letter) || remainingGuesses <= 0}
            style={[
              styles.letterButton,
              usedLetters.includes(letter) && styles.usedButton,
              remainingGuesses <= 0 && styles.disabledButton
            ]}
          >
            <Text style={[
              styles.letterText,
              usedLetters.includes(letter) && styles.usedLetterText
            ]}>
              {letter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleLetterPress = (letter: string) => {
    if (usedLetters.includes(letter) || remainingGuesses <= 0) return;
    
    setUsedLetters(prev => [...prev, letter]);
    
    if (word.includes(letter)) {
      let newDisplay = '';
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter || usedLetters.includes(word[i])) {
          newDisplay += word[i] + ' ';
        } else {
          newDisplay += '_ ';
        }
      }
      setDisplayWord(newDisplay.trim());
    } else {
      setRemainingGuesses(prev => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Word Sort Game</Text>
      
      <View style={styles.wordContainer}>
        <Text style={styles.word}>
          {displayWord || 'Press the button to start the game'}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={fetchRandomWord}
        disabled={loading}
      >
        <Text style={styles.startButtonText}>
          {loading ? 'Loading...' : 'Start Game'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <Text style={styles.guesses}>
        Remaining guesses: {remainingGuesses}
      </Text>

      <View style={styles.buttonsContainer}>
        {renderAlphabetButtons()}
      </View>

      {remainingGuesses === 0 && 
        <Text style={styles.gameOverText}>
          Game Over! The word was {word}
        </Text>
      }
      
      {displayWord.replace(/ /g, '') === word && word !== '' &&
        <Text style={styles.winText}>
          Congratulations! You guessed the word!
        </Text>
      }
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome to the Word Sort Game!" component={WelcomeScreen}/>
        <Stack.Screen name="Game" component={GameScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9B7EBD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wordContainer: {
    marginVertical: 20,
  },
  word: {
    fontSize: 24,
    letterSpacing: 2,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guesses: {
    fontSize: 18,
    marginVertical: 10,
  },
  alphabetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 300,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  letterButton: {
    width: 40,
    height: 40,
    margin: 5,
    backgroundColor: '#E3E3E3',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  usedButton: {
    backgroundColor: '#C0C0C0',
  },
  usedLetterText: {
    color: '#666',
  },
  disabledButton: {
    opacity: 0.5,
  },
  gameOverText: {
    color: 'red',
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
  winText: {
    color: 'green',
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
});