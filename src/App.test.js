import { render, screen, fireEvent } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import axios from 'axios';
import App from './App';

describe('Testing App', () => {
  const responseData = [
    {
      "id": "1751295897__Berlin",
      "label": "Berlin",
      "volume": 165,
      "type": "topic",
      "sentiment": {
        "negative": 3,
        "neutral": 133,
        "positive": 29
      },
      "sentimentScore": 65,
      "burst": 13,
      "days": [
        {
          "date": "2014-06-06T00:00:00.000+0000",
          "volume": 22
        },
        {
          "date": "2014-06-04T00:00:00.000+0000",
          "volume": 43
        },
        {
          "date": "2014-06-09T00:00:00.000+0000",
          "volume": 0
        },
        {
          "date": "2014-06-07T00:00:00.000+0000",
          "volume": 12
        },
        {
          "date": "2014-06-08T00:00:00.000+0000",
          "volume": 11
        },
        {
          "date": "2014-06-03T00:00:00.000+0000",
          "volume": 39
        },
        {
          "date": "2014-06-05T00:00:00.000+0000",
          "volume": 38
        }
      ],
      "pageType": {
        "blog": 17,
        "facebook": 56,
        "forum": 22,
        "general": 5,
        "image": 0,
        "news": 26,
        "review": 1,
        "twitter": 35,
        "video": 3
      },
      "queries": [
        {
          "id": 1751295897,
          "name": "Berghain",
          "volume": 165
        }
      ]
    },
    {
      "id": "1751295897__Quantified Drunk",
      "label": "Quantified Drunk",
      "volume": 14,
      "type": "topic",
      "sentiment": {
        "neutral": 14
      },
      "sentimentScore": 50,
      "burst": 7,
      "days": [
        {
          "date": "2014-06-06T00:00:00.000+0000",
          "volume": 1
        },
        {
          "date": "2014-06-04T00:00:00.000+0000",
          "volume": 8
        },
        {
          "date": "2014-06-09T00:00:00.000+0000",
          "volume": 0
        },
        {
          "date": "2014-06-07T00:00:00.000+0000",
          "volume": 0
        },
        {
          "date": "2014-06-08T00:00:00.000+0000",
          "volume": 1
        },
        {
          "date": "2014-06-03T00:00:00.000+0000",
          "volume": 0
        },
        {
          "date": "2014-06-05T00:00:00.000+0000",
          "volume": 4
        }
      ],
      "pageType": {
        "blog": 0,
        "facebook": 3,
        "forum": 0,
        "general": 0,
        "image": 0,
        "news": 0,
        "review": 0,
        "twitter": 11,
        "video": 0
      },
      "queries": [
        {
          "id": 1751295897,
          "name": "Berghain",
          "volume": 14
        }
      ]
    },
    {
      "id": "1751295897__Hammered",
      "label": "Hammered",
      "volume": 48,
      "type": "topic",
      "sentiment": {
        "neutral": 18,
        "negative": 30
      },
      "sentimentScore": 20,
      "burst": 5,
      "days": [
        {
          "date": "2014-06-06T00:00:00.000+0000",
          "volume": 1
        },
        {
          "date": "2014-06-04T00:00:00.000+0000",
          "volume": 8
        },
        {
          "date": "2014-06-09T00:00:00.000+0000",
          "volume": 0
        },
        {
          "date": "2014-06-07T00:00:00.000+0000",
          "volume": 0
        },
        {
          "date": "2014-06-08T00:00:00.000+0000",
          "volume": 1
        },
        {
          "date": "2014-06-03T00:00:00.000+0000",
          "volume": 0
        },
        {
          "date": "2014-06-05T00:00:00.000+0000",
          "volume": 8
        }
      ],
      "pageType": {
        "blog": 0,
        "facebook": 3,
        "forum": 0,
        "general": 0,
        "image": 0,
        "news": 0,
        "review": 0,
        "twitter": 15,
        "video": 0
      },
      "queries": [
        {
          "id": 1751295897,
          "name": "Berghain",
          "volume": 18
        }
      ]
    },
  ];

  let axiosGetSpy = null;

  beforeEach(() => {
    axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: responseData });
  });

  afterEach(() => {
    axiosGetSpy.mockClear();
  })

  test('render correctly', () => {
    const tree = TestRenderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('get topic color', async () => {
    const { findByTestId } = render(<App />);

    expect(axiosGetSpy).toBeCalledWith(`${process.env.REACT_APP_API_URL}/api/topics`);

    const topic1 = await findByTestId(responseData[0].id);
    expect(topic1).toBeTruthy();
    expect(topic1).toHaveClass('Topic-Green');
    expect(topic1).toHaveClass('Topic-Font6');

    const topic2 = await findByTestId(responseData[1].id);
    expect(topic2).toBeTruthy();
    expect(topic2).toHaveClass('Topic');
    expect(topic2).toHaveClass('Topic-Font1');

    const topic3 = await findByTestId(responseData[2].id);
    expect(topic3).toBeTruthy();
    expect(topic3).toHaveClass('Topic-Red');
    expect(topic3).toHaveClass('Topic-Font2');
  });

  test('click topic', async () => {
    const { findByTestId, findByText } = render(<App />);

    expect(axiosGetSpy).toBeCalledWith(`${process.env.REACT_APP_API_URL}/api/topics`);

    const topic = await findByTestId(responseData[0].id);
    expect(topic).toBeTruthy();

    fireEvent.click(topic);

    const negative = await findByText(`Negative Mentions:`);
    const negativeContent = await findByTestId('negative');
    const negativeValue = responseData[0].sentiment.negative;
    expect(negative).toBeTruthy();
    expect(negativeContent.textContent).toBe(` ${negativeValue}`);

    const positive = await findByText('Positive Mentions:');
    const positiveContent = await findByTestId('positive');
    const positiveValue = responseData[0].sentiment.positive;
    expect(positive).toBeTruthy();
    expect(positiveContent.textContent).toBe(` ${positiveValue}`);

    const neutral = await findByText('Neutral Mentions:');
    const neutralContent = await findByTestId('neutral');
    const neutralValue = responseData[0].sentiment.neutral;
    expect(neutral).toBeTruthy();
    expect(neutralContent.textContent).toBe(` ${neutralValue}`);

    const totalContent = await findByTestId('total');
    const totalValue = responseData[0].volume;
    expect(totalContent.textContent).toBe(` ${totalValue}`);
  })
})
