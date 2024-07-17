import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Container, Content, Header, InputContainer, Logo, MissingEndpointModal, NoDataContainer, ShadowContainer } from "./style";
import { getHotels } from "../../api/hotel";
import { Hotel } from "../../utils/types/hotelTypes";
import HotelItem from "../../components/HotelItem";
import LogoIcon from '../../assets/purple-logo-1.png'
import BookingIcon from '../../assets/icons/booking.svg';
import InputCollection from "../../components/InputCollection";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { differenceInDays, format } from "date-fns";
import ItemModal from "../../components/ItemModal";
import useClickOutside from "../../utils/hooks/useClickOutside";
import { BOOKING, PATH } from "../../utils/strings";

const Booking: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { date } = useSelector((state: RootState) => state.user);

  const params = new URLSearchParams(location.search);
  const destination = params.get('destination');
  const checkin = params.get('checkin');
  const checkout = params.get('checkout');
  const adults = params.get('adults');
  const children = params.get('children');
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [_destination, setDestination] = useState<string>(destination || '');
  const [_checkin, setCheckin] = useState<string>(checkin || '');
  const [_checkout, setcheckout] = useState<string>(checkout || '');
  const [_people, setPeople] = useState<string>(`${adults} and ${children}`);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectHotel, setSelectHotel] = useState<Hotel>();
  const [noData, setNoData] = useState<boolean>(false);

  const [missingEndpoint, setMissingEndpoint] = useState<boolean>(false);

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
    const getHotelsExample = async () => {
      const response: AxiosResponse<any, any> | any = await getHotels();
      
      if (response.message) {
        setMissingEndpoint(true);
      }

      if (response && response.data) {
        setHotels(response.data.value);
        setLoading(false);
        if (missingEndpoint) {
          setMissingEndpoint(false);
        }
      };
    };  

    getHotelsExample();
  }, []);

  useEffect(() => {
    const hotelsFound = hotels.filter((el) => el.Address.City.toLowerCase() === _destination.toLowerCase());

    console.log(hotelsFound.length);

    if (_destination.length > 0 && hotelsFound.length === 0) {
      setNoData(true);
    } else {
      setNoData(false);
    }

    console.log('noData', noData);
  }, [_destination]);

  useEffect(() => {
    setCheckin(format(date[0], 'MM/dd/yyyy'));
    setcheckout(format(date[1], 'MM/dd/yyyy'));
    setIsCalendarOpen(false);
  }, [date]);

  return (
    <Container>
      <Header>
        <div onClick={() => navigate(PATH.RESERVATION)} className="reservation-button-container">
          <img src={BookingIcon} alt="BookingIcon" />
          <span>Reservation</span>
        </div>
        <Logo src={LogoIcon} alt="LogoIcon" />
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
            {hotels.filter((el) => el.Address.City === _destination).map((hotel, index) => (
              <HotelItem totalPrice={validateTotalPrice(hotel)} onClick={() => handleHotelSelected(hotel)} hotel={hotel} />
            ))}
            {destination === _destination || noData && (
              <NoDataContainer>
                <span>{BOOKING.NO_DATA}</span>
              </NoDataContainer>
            )}
            {_destination.length > 0 && hotels.filter((el) => el.Address.City !== _destination).length && (
              <NoDataContainer>
                <span>{BOOKING.ALSO_TRY}</span>
              </NoDataContainer>
            )}
            {hotels.filter((el) => el.Address.City !== _destination).map((hotel, index) => (
              <HotelItem totalPrice={validateTotalPrice(hotel)} onClick={() => handleHotelSelected(hotel)} hotel={hotel} />
            ))}
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