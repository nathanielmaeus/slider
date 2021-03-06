import * as React from 'react';

import { Container, Logo, Location, Stats, Stat, StatCount, StatTitle } from './styles.css';

export interface ISidebarProps {
  type: 'full' | 'simple';
}

const UserInfo: React.FC<ISidebarProps> = ({ type }) => {
  const renderFullView = (): React.ReactElement => (
    <>
      <Location>Moscow, Russia</Location>
      <Stats>
        <Stat>
          <StatCount>177K</StatCount>
          <StatTitle>Followers</StatTitle>
        </Stat>
        <Stat>
          <StatCount>54</StatCount>
          <StatTitle>Countries</StatTitle>
        </Stat>
        <Stat>
          <StatCount>4.8</StatCount>
          <StatTitle>Rating</StatTitle>
        </Stat>
      </Stats>
    </>
  );

  return (
    <Container>
      <Logo small={type === 'simple'} src="src/assets/1.jpg"></Logo>
      {type === 'full' && renderFullView()}
    </Container>
  );
};

export default UserInfo;
