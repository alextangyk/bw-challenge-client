import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    const getTopicsApi = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/topics`);
        const topics = response.data;
        setTopics(topics);
      } catch (error) { }
    }
    getTopicsApi()
  }, []);

  const selectTopicMeta = topics.find(t => t.label === selectedTopic);

  const positive = selectTopicMeta?.sentiment?.positive || 0;
  const neutral = selectTopicMeta?.sentiment?.neutral || 0;
  const negative = selectTopicMeta?.sentiment?.negative || 0;
  const total = selectTopicMeta?.volume;

  const volumes = topics.map(t => t.volume);
  const minVolume = volumes.length > 0 ? Math.min(...volumes) : -1;
  const maxVolume = volumes.length > 0 ? Math.max(...volumes) : -1;
  const division = (maxVolume - minVolume) / 6;

  return (
    <div className="App">
      <h1>
        My Topics Challenge
      </h1>
      <div className="Container">
        <div className="Col">
          {
            topics.map(topic => {
              let colorClassName = "Topic";
              if (topic.sentimentScore > 60) {
                colorClassName = "Topic-Green";
              } else if (topic.sentimentScore < 40) {
                colorClassName = "Topic-Red";
              }

              let size = 1;
              if (minVolume > 0 && maxVolume > 0) {
                const checkValue = topic.volume - minVolume;

                for (let i = 0; i < 6; i += 1) {
                  if (checkValue === 0 || 
                    (checkValue > i * division && checkValue <= ((i + 1) * division))) {
                    size = i + 1;
                    break;
                  }
                }
              }

              return (
                <div 
                  key={topic.id} 
                  data-testid={topic.id} 
                  className={`${colorClassName} Topic-Font${size}`} 
                  onClick={() => setSelectedTopic(topic.label)}
                >
                  {topic.label}
                </div>
              );
            })
          }
        </div>
        {selectTopicMeta && <div className="Col">
          <div>Infomation of Topic <span>{`"${selectedTopic}"`}</span></div>
          <br />
          <div>Total Mentions:<span data-testid="total">{` ${total}`}</span></div>
          <br />
          <div>Positive Mentions:<span data-testid="positive" className="Topic-Green">{` ${positive}`}</span></div>
          <div>Neutral Mentions:<span data-testid="neutral">{` ${neutral}`}</span></div>
          <div>Negative Mentions:<span data-testid="negative" className="Topic-Red">{` ${negative}`}</span></div>
        </div>}

      </div>

    </div>
  );
}

export default App;
