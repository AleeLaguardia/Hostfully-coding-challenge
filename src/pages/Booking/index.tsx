import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Container, Content, Header, InputContainer, Logo, MissingEndpointModal, NoDataContainer, PaginationButton, PaginationContainer, PaginationInfo, ProfileContainer, ShadowContainer } from "./style";
import { getHotels } from "../../api/hotel";
import { getAllReservations, ReservationResponse } from "../../api/auth";
import { Hotel } from "../../utils/types/hotelTypes";
import HotelItem from "../../components/HotelItem";
import LogoIcon from '../../assets/purple-logo-1.png'
import InputCollection from "../../components/InputCollection";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { differenceInDays, format } from "date-fns";
import ItemModal from "../../components/ItemModal";
import useClickOutside from "../../utils/hooks/useClickOutside";
import { BOOKING } from "../../utils/strings";
import AuthHeader from "../../components/AuthHeader";

const Booking: React.FC = () => {
  const location = useLocation();
  const { date } = useSelector((state: RootState) => state.user);

  const params = new URLSearchParams(location.search);
  const destination = params.get('destination');
  const checkin = params.get('checkin');
  const checkout = params.get('checkout');
  const adults = params.get('adults');
  const children = params.get('children');

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [_destination, setDestination] = useState<string>(destination || '');
  const [_checkin, setCheckin] = useState<string>(checkin || '');
  const [_checkout, setcheckout] = useState<string>(checkout || '');
  const [_people] = useState<string>(`${adults || '2 adults'} and ${children || 'No children'}`);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectHotel, setSelectHotel] = useState<Hotel>();
  const [noData, setNoData] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [missingEndpoint, setMissingEndpoint] = useState<boolean>(false);

  const ITEMS_PER_PAGE = 10;

  const datesOverlap = (checkIn1: string, checkOut1: string, checkIn2: Date, checkOut2: Date): boolean => {
    const start1 = new Date(checkIn1);
    const end1 = new Date(checkOut1);
    return start1 < checkOut2 && checkIn2 < end1;
  };

  const getAvailableHotels = (hotelList: Hotel[]): Hotel[] => {
    if (!date || !date[0] || !date[1]) return hotelList;

    return hotelList.filter((hotel) => {
      const hasConflict = reservations.some((res) => {
        const isSameHotel = res.hotel.HotelId === hotel.HotelId;
        const hasDateOverlap = datesOverlap(res.checkIn, res.checkOut, date[0], date[1]);
        return isSameHotel && hasDateOverlap;
      });
      return !hasConflict;
    });
  };

  const getAllDisplayHotels = (): Hotel[] => {
    const available = getAvailableHotels(hotels);

    if (_destination.trim().length === 0) {
      return available;
    }

    return available.filter((el) => el.Address.City.toLowerCase() === _destination.toLowerCase());
  };

  const allDisplayHotels = getAllDisplayHotels();
  const totalPages = Math.ceil(allDisplayHotels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHotels = allDisplayHotels.slice(startIndex, endIndex);

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const modalRef = useClickOutside(() => setIsModalOpen(false));

  const handleHotelSelected = (hotel: Hotel) => {
    setSelectHotel(hotel);
    setIsModalOpen(true);
  }

  const validateTotalPrice = (hotel: Hotel) => {
    const firstDate = date[0];
    const secondDate = date[1];

    const days = differenceInDays(secondDate, firstDate);
    const totalPrice = hotel.Rooms[0].BaseRate * days;

    return `$ ${totalPrice.toFixed(2)}`;
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const hotelsResponse: AxiosResponse<any, any> | any = await getHotels();

      if (hotelsResponse.message) {
        setMissingEndpoint(true);
      }

      if (hotelsResponse && hotelsResponse.data) {
        setHotels(hotelsResponse.data.value);
        if (missingEndpoint) {
          setMissingEndpoint(false);
        }
      }

      const reservationsResponse = await getAllReservations();
      if ('data' in reservationsResponse) {
        setReservations(reservationsResponse.data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const available = getAvailableHotels(hotels);
    const hotelsFound = available.filter((el) => el.Address.City.toLowerCase() === _destination.toLowerCase());

    if (_destination.trim().length > 0 && hotelsFound.length === 0) {
      setNoData(true);
    } else {
      setNoData(false);
    }

    setCurrentPage(1);
  }, [_destination, hotels, reservations]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    setCheckin(format(date[0], 'MM/dd/yyyy'));
    setcheckout(format(date[1], 'MM/dd/yyyy'));
    setIsCalendarOpen(false);

    const refreshReservations = async () => {
      const reservationsResponse = await getAllReservations();
      if ('data' in reservationsResponse) {
        setReservations(reservationsResponse.data);
      }
    };
    refreshReservations();
  }, [date]);

  return (
    <Container>
      <Header>
        <Logo src={LogoIcon} alt="LogoIcon" />
        <ProfileContainer>
          <AuthHeader />
        </ProfileContainer>
        <InputContainer>
          <InputCollection
            destination={_destination || ''}
            startDate={_checkin || ''}
            endDate={_checkout || ''}
            people={_people || ''}
            confirmChanges={() => {}}
            onDestinationChange={(e) => setDestination(e.target.value)}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
          />
        </InputContainer>
      </Header>
      <Content dataAvailable={hotels.length > 0}>
        {loading ? <div /> : (
          <>
            {noData && (
              <NoDataContainer>
                <span>{BOOKING.NO_DATA}</span>
              </NoDataContainer>
            )}
            {paginatedHotels.map((hotel) => (
              <HotelItem key={hotel.HotelId} totalPrice={validateTotalPrice(hotel)} onClick={() => handleHotelSelected(hotel)} hotel={hotel} />
            ))}
            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </PaginationButton>
                {getPageNumbers().map((page) => (
                  <PaginationButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationButton>
                ))}
                <PaginationButton
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </PaginationButton>
                <PaginationInfo>
                  {startIndex + 1}-{Math.min(endIndex, allDisplayHotels.length)} of {allDisplayHotels.length}
                </PaginationInfo>
              </PaginationContainer>
            )}
          </>
        )}
      </Content>
      {isModalOpen && (
        <ShadowContainer onClick={(e) => setIsModalOpen(false)}>
          <ItemModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            totalPrice={validateTotalPrice(selectHotel || hotels[0])}
            ref={modalRef}
            hotel={selectHotel || hotels[0]}
          />
        </ShadowContainer>
      )}
      {missingEndpoint && (
        <ShadowContainer>
          <MissingEndpointModal>
            <span className="title">Please, follow these instructions</span>
            <span>In order to make this work, you need to access https://designer.mocky.io/design</span>
            <span>Open the file text.json, copy everything that is inside and paste in the HTTP Response Body box</span>
            <span>Once that is done, click on GENERATE MY HTTP RESPONSE</span>
            <span>There will be a link generated like this: https://run.mocky.io/v3/ff652d7a-9460-41a2-9202-ace4bae106c2/</span>
            <span>Take the last part of this endpoint and change it in this variable endpoint in src/api/hotel.ts</span>
          </MissingEndpointModal>
        </ShadowContainer>
      )}
    </Container>
  );
};

export default Booking;
