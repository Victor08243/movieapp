import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';

export default function App() {
  const apiurl = "http://www.omdbapi.com/?&apikey=28f4dae9"
  const [state, setState] = useState({
    searchBarText: "movie",
    results: [],
    selected: {}
  });

  const search = () => {
    axios(apiurl + "&s=" + state.searchBarText).then(({ data }) => {
      let results = data.Search
      setState(prevState => {
        return { ...prevState, results: results } 
      })
    })
  }

  const openPopup = id => {
    axios(apiurl + "&i=" + id).then(({ data }) => {
      let result = data;
      console.log(result);
      setState(prevState => {
        return { ...prevState, selected: result }
      });
    });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Movie Info</Text>
      <TextInput
        style={styles.searchbox}
        onChangeText={text => setState(prevState => {
          return { ...prevState, searchBarText: text }
        })}
        onSubmitEditing={search}
        value={state.searchBarText}
      />

      <ScrollView style={styles.searchResultsList}>
        {state.results.map(result => (
          <TouchableHighlight
            key={result.imdbID}
            onPress={() => openPopup(result.imdbID)}>
            <View style={styles.searchResultListComponent}>
              <Image
                source={{ uri: result.Poster }}
                style={styles.searchResultList_Poster}
                resizeMode="cover"
              />
              <Text style={styles.searchResultList_Title}>{result.Title}</Text>
              <Text style={styles.searchResultList_Year}>{result.Year}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={false}
        visible={(typeof state.selected.Title != "undefined")}
      >
        <View style={styles.popUpMovieInfo}>
          <Image style={styles.popUpMovieInfo_Poster} source={{ uri: state.selected.Poster }}></Image>
          <Text style={styles.popUpMovieInfo_Title}>{state.selected.Title}</Text>
          <Text style={styles.popUpMovieInfo_Year}>{state.selected.Year}</Text>
          <Text style={styles.popUpMovieInfo_Rating}>Rating: {state.selected.imdbRating}</Text>
          <Text style={styles.popUpMovieInfo_Genre}>Genre: {state.selected.Genre}</Text>
          <Text>{state.selected.Plot}</Text>
        </View>
        <TouchableHighlight
          onPress={() => setState(prevState => {
            return { ...prevState, selected: {} }
          })}
        >
          <Text style={styles.closeBtn}>Close</Text>
        </TouchableHighlight>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#223343',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 20
  },
  appTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10
  },
  searchbox: {
    fontSize: 20,
    fontWeight: '300',
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 40
  },
  searchResultsList: {
    flex: 1
  },
  searchResultListComponent: {
    flex: 1,
    width: '100%',
    marginBottom: 20
  },
  searchResultList_Poster:{
    width: '100%',
    height: 300
  },
  searchResultList_Title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: '#445565',
    textAlign: 'center'
  },
  searchResultList_Year: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: '#445565',
    textAlign: 'center'
  },
  popUpMovieInfo: {
    padding: 20
  },
  popUpMovieInfo_Title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5
  },
  popUpMovieInfo_Poster: {
    width: '100%',
    height: 300
  },
  popUpMovieInfo_Year: {
    fontWeight: '700',
    marginBottom: 5
  },
  popUpMovieInfo_Rating: {
    marginBottom: 20
  },
  popUpMovieInfo_Genre: {
    marginBottom: 20
  },
  closeBtn: {
    textAlign: 'center',
    padding: 20,
    fontSize: 20,
    color: '#FFF',
    fontWeight: '700',
    backgroundColor: '#2484C4'
  }
});
