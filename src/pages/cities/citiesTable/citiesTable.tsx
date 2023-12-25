import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useAppSelector } from 'app/hooks';
import { ReactLoader, StyledTableCell, StyledTableRow } from 'components';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { allEnabledCitiesSelector, citiesLoadingSelector } from 'redux/selectors/cities';

const mainTextStyles = {
  color: '#1E1E70',
  fontSize: '12px',
};

const CitiesTable: FC = () => {
  const navigate = useNavigate();
  const cities = useAppSelector(allEnabledCitiesSelector);
  const loading = useAppSelector(citiesLoadingSelector);

  const onClickHandler = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    cityId: string
  ) => {
    if (e.metaKey || e.ctrlKey) {
      window.open(
        `${window.location.origin}/cities/edit/${cityId}`,
        '_blank',
        'noreferrer'
      );
    } else {
      navigate(`/cities/edit/${cityId}`);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
      {!loading ? (
        cities?.length ? (
          <TableContainer sx={{ maxHeight: '69vh' }}>
            <Table aria-label="customized table" stickyHeader>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="left">
                    <TableSortLabel disabled>City</TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <TableSortLabel disabled>Code</TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <TableSortLabel disabled>Country</TableSortLabel>
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {cities.map((city) => (
                  <StyledTableRow
                    key={city._id}
                    className="table-row"
                    onClick={(e) => onClickHandler(e, city._id)}
                  >
                    <StyledTableCell sx={mainTextStyles} align="left">
                      {city.name}
                    </StyledTableCell>
                    <StyledTableCell sx={mainTextStyles} align="left">
                      {city.code}
                    </StyledTableCell>
                    <StyledTableCell sx={mainTextStyles} align="left">
                      {city.country?.name}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null
      ) : (
        <ReactLoader />
      )}
    </Paper>
  );
};

export default CitiesTable;
