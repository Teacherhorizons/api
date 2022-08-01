import { AxiosInstance } from 'axios';
import querystring from 'querystring';

export const addSchool = async (api: AxiosInstance, num: number): Promise<Config.School> => {
  const payload = {
    continent: 4,
    country: 23,
    'city.id': 86,
    'data.city.id': 86,
    name: 'My test school ' + num,
  };
  try {
    await api.get('admin/listing/Schools/edit/0');
    // console.log('school get1 successful');
    try {
      await api.post('admin/listing/Schools/edit/0', querystring.stringify(payload));
    } catch (error) {
      console.log('continue school');
      // console.log('Addschool', error);
    }
    // console.log('school post1 successful');
    const getResponse = await api.get('/v3/school/slug/europe-germany-berlin-my-test-school-' + num + '/profile');
    // console.log('school get2 successful');
    console.log('school added successfully');
    return {
      id: getResponse.data.school.schoolId,
      slug: getResponse.data.school.slug,
    };
  } catch (error) {
    console.log('addSchool', error);
  }
};

// update School PUT
export const updateSchool = async (
  api: AxiosInstance,
  num: number,
  schoolId: number,
  teacherMemberNumber: number,
  managedByNumber: number
): Promise<Config.School> => {
  const userResponse = await api.get('v1/user/bundle');
  const data = {
    token: userResponse.data.token,
    profileCompletionPercentage: 99,
    genderRatioId: 4,
    isPayScaleBasedOnExperience: true,
    headTeacherName: 'Josh Rogan',
    yearFounded: 1987,
    educationAgeLevelIds: [1, 2, 3],
    academicSystemIds: [1, 2, 3],
    fundingTypeId: 2,
    religiousAffiliationId: 3,
    accreditationIds: [1, 2, 3],
    curriculumIds: [1, 2, 3],
    isAcademicallySelective: true,
    monthSchoolYearBegins: 9,
    percentageOfInternationalStudents: 17,
    numberOfStudents: 347,
    numberOfPreSchoolStudents: 32,
    averagePreSchoolClassSize: 23,
    numberOfPrimaryStudents: 144,
    averagePrimaryClassSize: 32,
    numberOfSecondaryStudents: 126,
    averageSecondaryClassSize: 12,
    numberOfPost16Students: 66,
    averagePost16ClassSize: 6,
    percentageOfOverseasTeachers: 13,
    mainTeacherNationalityIds: [206, 207],
    annualTeacherTurnoverPercentage: 15,
    numberOfOverseasTeachersRecruitedPerYear: 7,
    teachingLanguageIds: [1, 2, 3],
    isOpenToTeflTeachers: true,
    facilityIds: [1, 2, 3],
    locationLatLong: '-8.8383333, 13.2344444',
    monthRecruitmentBegins: 7,
    minimumYearsTeachingExperience: 3,
    acceptedTeacherNationalityGroupIds: [206, 207],
    leadRecruitmentContactName: 'Barty Berty',
    leadRecruitmentContactEmail: 'barty@aa.bb.cc',
    internationalWorkingCurrencyId: 2,
    grossSalaryJuniorTeacher: 1234.56,
    grossSalarySeniorTeacher: 3456.78,
    juniorTeacherTaxPercentage: 19,
    seniorTeacherTaxPercentage: 21,
    contractLengthInYears: 2,
    amountIndividualTeacherSavesYearly: 12,
    canSalarySupportFamilyOfFour: false,
    hasTeacherSavingScheme: false,
    numberOfSchoolDaysPerYear: 188,
    numberOfTeachingHoursPerWeek: 32,
    // numberOfExtraCurricularHoursPerWeek: null,
    flightAllowanceId: 7,
    relocationAllowanceId: 3,
    pensionSchemeId: 1,
    teacherPensionContributionPercentage: 12,
    schoolPensionContributionPercentage: 12,
    hasFreePrivateHealthcareScheme: false,
    websiteUrl: 'www.mad.co.uk',
    promoVideoUrl: 'erty.jty.pip?lipsalve32',
    requiredTeacherQualificationIds: [1, 2, 3],
    address1: 'line 1 of address',
    address2: 'line 2 of address',
    address3: 'line 3 of address',
    phoneNumber: '123456789',
    phoneCodeCountryId: 44,
    acronym: 'TRYP',
    isInterestedInRecruitmentServices: false,
    isSubscribedToCandidateSuggestionEmails: false,
    discountForStaffChildrenPercentage: 37,
    hasPlacesForStaffChildren: true,
    monthlyStaffAccommodationAllowance: 23.67,
    additionalBenefitInformationText: 'the best of days; the worst of days',
    hasStaffLanguageLessonAllowance: false,
    hasStaffLaptopAllowance: false,
    hasStaffAccommodationBenefit: 0,
    numberOfTeachingStaff: 39,
    ambassadorMemberNumber: teacherMemberNumber,
    additionalContractText: 'additional contract text',
    thRating: 7.5,
    managedByUserId: managedByNumber, //school-1-school@th.test user id = 1031
  };
  try {
    console.log('school update successful 101');
    try {
      console.log('school update successful 102');
      await api.put(`v3/school/id/${schoolId}/update?data=${JSON.stringify(data)}`);
      console.log('school update successful 103');
    } catch (error) {
      console.log('updateSchoolP1Error', error);
    }
    const getResponse = await api.get(`/v3/school/slug/europe-germany-berlin-my-test-school-${num}/profile`);
    console.log(`school ${num} updated successfully`);
    return {
      id: getResponse.data.school.schoolId,
      slug: getResponse.data.school.slug,
    };
  } catch (error) {
    console.log('updateSchoolP2Error', error);
  }
};
