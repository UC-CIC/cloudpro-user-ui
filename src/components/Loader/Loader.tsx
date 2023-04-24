import { Box, Circle } from '@chakra-ui/react';

import './Loader.css';

const Loader = () => (
  <Box position="relative" display="inline-block" width={16} height={16}>
    {Array.from(Array(9)).map((_, idx) => {
      return (
        <Circle
          key={idx}
          animation="loader 2s linear infinite"
          position="absolute"
          top={6 * Math.floor(idx / 3)}
          left={6 * (idx % 3)}
          size={4}
          bgColor="teal"
          style={{ animationDelay: `-${Math.random() * 2400}ms` }}
        />
      );
    })}
  </Box>
);

export default Loader;
