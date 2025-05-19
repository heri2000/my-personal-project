import { useState } from "react";
import { CpSpinner } from "../components/cpSpinner";
import { addNewMember, updateMember, type TMember } from "../api/member";
import { dateToSqlString, parseErrorMessage, sqlDateTimeToSqlDate } from "@/app/utils/utils";
import { enEN } from "@/app/translations/enEN";
import { TSessionData } from "../api/user";

export const VISIBLE_LAYER_MEMBER_NEW = "visible_layer_member_new";
export const VISIBLE_LAYER_MEMBER_EDIT = "visible_layer_member_edit";

const initialMemberState: TMember = {
  id: "",
  regNumber: "",
  name: "",
  gender: "L",
  address: "",
  birthDate: "",
  phone1: "",
  phone2: "",
  marriageDate: "",
  category: null,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
};

export function MemberEdit({
  activeSessionData,
  visibleLayer,
  memberToEdit,
  handleGoBack,
  handleNewMemberAdded,
  handleMemberUpdated,
}: {
  activeSessionData: TSessionData,
  visibleLayer: string,
  memberToEdit: TMember | null,
  handleGoBack: () => void
  handleNewMemberAdded: (member: TMember) => void
  handleMemberUpdated: () => void
}) {
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState(memberToEdit || initialMemberState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const translationStrings = enEN;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    if (event.target.type === 'date') {
      setMember({...member, [event.target.name]: dateToSqlString(event.target.value) });
    } else {
      setMember({...member, [event.target.name]: event.target.value });
    }
  }

  async function handleAddNewMember() {
    setErrorMessage(null);
    setLoading(true);
    const result = await addNewMember(activeSessionData.sessionId, member);
    if (result.status === 'OK') {
      if (result.id) {
        member.id = result.id;
      }
      handleNewMemberAdded(member);
    } else {
      if (result.errorMessage) {
        setErrorMessage(parseErrorMessage(translationStrings, result.errorMessage));
      }
    }
    setLoading(false);
  }

  async function handleUpdateMember() {
    setErrorMessage(null);
    setLoading(true);
    const result = await updateMember(activeSessionData.sessionId, member);
    if (result.status === 'OK') {
      handleMemberUpdated();
    } else {
      if (result.errorMessage) {
        setErrorMessage(parseErrorMessage(translationStrings, result.errorMessage));
      }
    }
    setLoading(false);
  }

  let pageTitle = translationStrings.addNewMember;
  if (visibleLayer === VISIBLE_LAYER_MEMBER_EDIT) {
    pageTitle = translationStrings.editMember;
  }

  return (
    <div className="flex flex-col w-full p-5 pt-15 md:pt-5">
      <h2 className="text-3xl font-bold">{pageTitle}</h2>
      <div className="flex flex-col min-h-100 w-full justify-center mt-4">
        <div className="flex flex-row w-full justify-center">
          <div className="flex flex-col w-full md:w-2/3 mb-10">
            <form>

              <div className="flex flex-row">
                <label htmlFor="regNumber">{translationStrings.regNumber}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                type="text"
                value={member.regNumber}
                onChange={handleChange}
                name="regNumber"
                id="regNumber"
                disabled={loading}
                autoFocus
              />
              </div>

              <div className="flex flex-row">
                <label htmlFor="name">{translationStrings.name}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  type="text"
                  value={member.name}
                  onChange={handleChange}
                  name="name"
                  id="name"
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-row">
                <label htmlFor="gender">{translationStrings.gender}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  type="radio"
                  name="gender"
                  id={translationStrings.male}
                  value={translationStrings.maleAbbreviated}
                  className="me-2"
                  checked={member.gender === translationStrings.maleAbbreviated}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  className="flex flex-col me-8 justify-center"
                  htmlFor={translationStrings.male}
                >
                  {translationStrings.male}
                </label>
                <input
                  type="radio"
                  name="gender"
                  id={translationStrings.female}
                  value={translationStrings.femaleAbbreviated}
                  className="me-2"
                  checked={member.gender === translationStrings.femaleAbbreviated}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  className="flex flex-col me-8 justify-center"
                  htmlFor={translationStrings.female}
                >
                  {translationStrings.female}
                </label>
              </div>

              <div className="flex flex-row">
                <label htmlFor="category">{translationStrings.category}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  type="radio"
                  name="category"
                  id="Associate"
                  value="Associate"
                  className="me-2"
                  checked={member.category === "Associate"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  className="flex flex-col me-8 justify-center"
                  htmlFor="Associate"
                >
                  Associate
                </label>
                <input
                  type="radio"
                  name="category"
                  id="General"
                  value="General"
                  className="me-2"
                  checked={member.category === "General"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  className="flex flex-col me-8 justify-center"
                  htmlFor="General"
                >
                  General
                </label>
                <input
                  type="radio"
                  name="category"
                  id="Child"
                  value="Child"
                  className="me-2"
                  checked={member.category === "Child"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  className="flex flex-col me-8 justify-center"
                  htmlFor="Child"
                >
                  Child
                </label>
              </div>

              <div className="flex flex-row">
                <label htmlFor="address">{translationStrings.address}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  type="text"
                  value={member.address!}
                  onChange={handleChange}
                  name="address"
                  id="address"
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-row">
                <label htmlFor="birthDate">{translationStrings.birthDate}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  aria-label="Date"
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  value={sqlDateTimeToSqlDate(member.birthDate)}
                  className="text-center"
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-row">
                <label htmlFor="phone1">{translationStrings.phone1}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  type="text"
                  value={member.phone1!}
                  onChange={handleChange}
                  name="phone1"
                  id="phone1"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-row">
                <label htmlFor="phone2">{translationStrings.phone2}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  type="text"
                  value={member.phone2!}
                  onChange={handleChange}
                  name="phone2"
                  id="phone2"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-row">
                <label htmlFor="marriageDate">{translationStrings.marriageDate}</label>
              </div>
              <div className="flex flex-row mb-4">
                <input
                  aria-label="Date"
                  type="date"
                  name="marriageDate"
                  id="marriageDate"
                  value={sqlDateTimeToSqlDate(member.marriageDate)}
                  className="text-center"
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {errorMessage && (
                <div className="error_message_color flex flex-row w-full justify-center mt-8">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-row w-full justify-center mt-8">
                {visibleLayer === VISIBLE_LAYER_MEMBER_NEW &&
                  <button
                    type="button"
                    className="primary me-4"
                    onClick={handleAddNewMember}
                    disabled={loading}
                  >
                    {translationStrings.addNewMember}
                  </button>
                }
                {visibleLayer === VISIBLE_LAYER_MEMBER_EDIT &&
                  <button
                    type="button"
                    className="primary me-4"
                    onClick={handleUpdateMember}
                    disabled={loading}
                  >
                    {translationStrings.saveChanges}
                  </button>
                }
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={loading}
                >
                  {translationStrings.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {loading && <CpSpinner />}
    </div>
  );
}
