import { FC, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { StyledTableCell, StyledTableRow, ReactLoader } from 'components';
import { useAppSelector } from 'app/hooks';
import { allPacesSelector, placeLoadingSelector } from 'redux/selectors/places';
import { placeTypesOptions } from 'models/place';
import { useNavigate } from 'react-router-dom';

const mainTextStyles = {
  color: '#1E1E70',
  fontSize: '12px',
};

const PlacesTable: FC = () => {
  const navigate = useNavigate();
  const places = useAppSelector(allPacesSelector);
  const loading = useAppSelector(placeLoadingSelector);

  const getTypeName = useCallback((type: string) => {
    const currentType = placeTypesOptions.find((e) => e.value === type);
    return currentType?.label || '';
  }, []);

  const onClickHandler = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    placeId: string
  ) => {
    if (e.metaKey || e.ctrlKey) {
      window.open(
        `${window.location.origin}/places/details/${placeId}`,
        '_blank',
        'noreferrer'
      );
    } else {
      navigate(`/places/details/${placeId}`);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
      {loading && !places?.length ? (
        <ReactLoader />
      ) : (
        <TableContainer sx={{ maxHeight: '69vh' }}>
          <Table aria-label="customized table" stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <TableSortLabel disabled>City</TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <TableSortLabel disabled>Name</TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <TableSortLabel disabled>Address</TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <TableSortLabel disabled>Access</TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <TableSortLabel disabled>Type</TableSortLabel>
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {places.map((place) => (
                <StyledTableRow
                  key={place._id}
                  className="table-row"
                  onClick={(e) => onClickHandler(e, place._id)}
                >
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {place.city.name}
                  </StyledTableCell>
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {place.name}
                  </StyledTableCell>
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {place.address}
                  </StyledTableCell>
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {place.membersOnly ? 'Private' : 'Public'}
                  </StyledTableCell>
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {getTypeName(place.type)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default PlacesTable;
