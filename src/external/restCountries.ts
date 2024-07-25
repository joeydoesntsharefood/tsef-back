import myaxios from './myAxios';

interface VerifyCountry {
  params?: string
  response: {
    success: boolean;
    errors?: string;
  }
}

type _verifyCountryCode = (value: VerifyCountry['params']) => Promise<VerifyCountry['response']>;

const verifyCountryCode: _verifyCountryCode = async (countryCode) => {
  if (!countryCode)
      return {
        success: false,
        errors: 'Envie por favor o countryCode',
      }
  
  const endPoint = `https://restcountries.com/v3.1/alpha/${countryCode}`;

  try {
    await myaxios.get(endPoint);
    
    return {
      success: true
    }
  } catch (e) {
    return {
      success: false,
      errors: e?.response?.data?.message,
    }
  }
};

export default verifyCountryCode;