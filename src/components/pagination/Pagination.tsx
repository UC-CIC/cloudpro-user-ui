import React from 'react';
import './page.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pagesToShow = 5;

  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    // <div className="pagination">
    //   <span>{`<< `}</span>
    //   {currentPage > 1 && (
    //     <span onClick={() => onPageChange(currentPage - 1)}>{`< `}</span>
    //   )}
    //   {pages.map(page => (
    //     <span key={page} className={page === currentPage ? 'active' : ''} onClick={() => onPageChange(page)}>{page}</span>
    //   ))}
    //   {currentPage < totalPages && (
    //     <span onClick={() => onPageChange(currentPage + 1)}>{` >`}</span>
    //   )}
    //   <span>{`  < page ${currentPage} of ${totalPages} >  `}</span>
    // </div>

    <div className="pagination">

      <span className={currentPage <= 1 ? 'disabled' : 'text-decoration-none'} onClick={() => onPageChange(currentPage - 1)}>{`<< `}</span>

      <span style={{textDecoration: 'none',cursor: 'auto'}}>{`  < page ${currentPage} of ${totalPages} >  `}</span>

      <span className={currentPage < totalPages ? 'text-decoration-none' : 'disabled'} onClick={() => onPageChange(currentPage + 1)}>{` >>`}</span>

    </div>
  );
};



// import React from 'react';
// import { Button, ButtonGroup } from "@chakra-ui/react";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
//   return (
//     <ButtonGroup spacing={4} mt={6}>
//       <Button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         Previous
//       </Button>
//       {[...Array(totalPages)].map((_, i) => (
//         <Button
//           key={i}
//           onClick={() => onPageChange(i + 1)}
//           colorScheme={currentPage === i + 1 ? "teal" : "gray"}
//         >
//           {i + 1}
//         </Button>
//       ))}
//       <Button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         Next
//       </Button>
//     </ButtonGroup>
//   );
// };


