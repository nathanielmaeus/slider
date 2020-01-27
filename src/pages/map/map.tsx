import * as React from 'react';

import SvgMap from './svgMap';
import { Container, Tooltip, Title, Text } from './styles.css';

const URL = 'https://en.wikipedia.org/api/rest_v1/page/html/2019–20_Wuhan_coronavirus_outbreak';
const OFFSET = 20;

interface ICountry {
  country: string;
  deaths: number;
  cases: number;
  gradation: number;
}

export interface IDataResponse {
  [key: string]: ICountry;
}

const Map: React.FC = () => {
  const [positionX, setPositionX] = React.useState<number>(0);
  const [positionY, setPositionY] = React.useState<number>(0);

  const [country, setCountry] = React.useState<string>('');
  const [data, setData] = React.useState<IDataResponse>({});

  React.useEffect(() => {
    const parseData = (html: string): IDataResponse | null => {
      const el = document.createElement('html');
      el.innerHTML = html;
      const col = el.querySelectorAll('table.wikitable tbody > tr');

      const data: IDataResponse = {};
      let maxCases = 0;
      for (let i = 1; i < col.length; i++) {
        const rows = col[i].querySelectorAll('td');
        if (rows.length < 3) {
          return null;
        }

        let countryNode = rows[0].textContent ? rows[0].textContent.trim() : null;
        if (countryNode === 'Total') {
          break;
        }

        if (countryNode) {
          const cases = rows[1].textContent && rows[1].textContent.replace(',', '');
          const deaths = rows[2].textContent && rows[2].textContent.replace(',', '');

          if (maxCases < Number(cases)) {
            maxCases = Number(cases);
          }

          if (countryNode.includes('China')) {
            countryNode = 'China';
          }
          if (!cases || !deaths) {
            break;
          }

          data[`${countryNode}`] = {
            country: countryNode,
            cases: Number(cases),
            deaths: Number(deaths),
            gradation: 1,
          };
        }
      }
      Object.keys(data).forEach(key => {
        data[key].gradation = Math.ceil(data[key].cases / maxCases);
      });
      return data;
    };

    fetch(URL)
      .then(response => response.text())
      .then(html => {
        const data = parseData(html);
        data && setData(data);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch page: ', err);
      });
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<SVGElement>): void => {
    const currentCountry = (e.target as SVGElement).getAttribute('data-title') || 'sdsds';
    setCountry(currentCountry);
    setPositionX(e.pageX);
    setPositionY(e.pageY);
  };

  return (
    <Container>
      <SvgMap onMouseOver={handleMouseEnter} data={data} />
      {true && (
        <Tooltip style={{ left: positionX + OFFSET, top: positionY + OFFSET }}>
          <Title>{country}</Title>
          <Text>cases: {data[country] ? data[country].cases : 'NO cases'}</Text>
          <Text>deaths: {data[country] ? data[country].deaths : 'NO dead'}</Text>
        </Tooltip>
      )}
    </Container>
  );
};

export default Map;