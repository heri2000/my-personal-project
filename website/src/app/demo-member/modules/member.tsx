import { useState, useEffect, ChangeEvent } from "react";
import ReactPaginate from "react-paginate";
import { PAGE_LIMITS, dateToString, parseErrorMessage } from "@/app/utils/utils";
import { fetchMemberList, deleteMember, type TMember } from "../api/member";
import { MemberImport, VISIBLE_LAYER_MEMBER_IMPORT } from "./memberImport";
import { MemberExport, VISIBLE_LAYER_MEMBER_EXPORT } from "./memberExport";
import { MemberEdit, VISIBLE_LAYER_MEMBER_NEW, VISIBLE_LAYER_MEMBER_EDIT } from "./memberEdit";
import { CpDialog } from "../components/cpDialog";
import { CpSpinner } from "../components/cpSpinner";
import { enEN } from "@/app/translations/enEN";
import {
  IcArrowDropDownIcon,
  IcArrowDropUpIcon,
  IcCloseIcon,
  IcDeleteIcon,
  IcEditIcon,
  IcRefreshIcon,
  IcSearchIcon,
} from "../components/IcIcons";
import { TSessionData } from "../api/user";

export const CURRENT_PAGE_MEMBER = "current_page_member";
const VISIBLE_LAYER_MEMBER = "visible_layer_member";
const LOCAL_STORAGE_LIMIT_KEY = "member_list_limit";
const VISIBLE_DIALOG_DELETE = "visible_dialog_delete";

export function Member(
  { activeSessionData }:
  { activeSessionData: TSessionData }
) {
  const translationStrings = enEN;
  // const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [visibleLayer, setVisibleLayer] = useState(VISIBLE_LAYER_MEMBER);
  const [visibleDialog, setVisibleDialog] = useState("");
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null);
  let pageLimit = PAGE_LIMITS[0];
  const storedLimit = localStorage.getItem(LOCAL_STORAGE_LIMIT_KEY);
  if (storedLimit) {
    pageLimit = Number(storedLimit);
  }
  const [selectedLimit, setSelectedLimit] = useState(pageLimit);
  const [memberList, setMemberList] = useState<TMember[]>([]);
  const [memberToEdit, setMemberToEdit] = useState<TMember | null>(null);
  const [totalMemberCount, setTotalMemberCount] = useState(0);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(-1);
  const [pageCount, setPageCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("regNumber");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [loading, setLoading] = useState(false);

  const permissions = {
    allowedToAddNewMeber: false,
    allowedToEditMember: false,
    allowedToDeleteMember: false,
    allowedToImportMembers: false,
    allowedToExportMembers: false,
  };

  if (activeSessionData) {
    permissions.allowedToAddNewMeber =
      activeSessionData.role === "admin" || activeSessionData.role === "staff";
    permissions.allowedToEditMember = permissions.allowedToAddNewMeber
    permissions.allowedToDeleteMember = permissions.allowedToAddNewMeber
    permissions.allowedToImportMembers = permissions.allowedToAddNewMeber
    permissions.allowedToExportMembers = permissions.allowedToAddNewMeber
  }

  useEffect(() => {
    doFetchMemberList(
      storedLimit ? Number(storedLimit) : PAGE_LIMITS[0],
      0,
      "",
      "regNumber asc",
    );
  }, [pageLimit]);

  async function handleButtonRefreshClick() {
    doFetchMemberList(
      selectedLimit,
      selectedLimit * pageRangeDisplayed,
      showSearch ? searchText : "",
      `${orderBy} ${orderDirection}`,
    );
  }

  async function doFetchMemberList(
    limit: number,
    offset: number,
    search: string,
    order: string,
  ) {
    setLoading(true);
    const result = await fetchMemberList(
      activeSessionData.sessionId, limit, offset, search, order
    );

    if (result.status === 'error') {
      setMemberList([]);
      setTotalMemberCount(0);
      setPageCount(0);
      setPageRangeDisplayed(1);
      setLoading(false);
      return;
    }

    setMemberList(result.members || []);
    setTotalMemberCount(result.totalMemberCount);
    setPageCount(Math.ceil(result.totalMemberCount / limit));
    if (pageRangeDisplayed < 0) {
      setPageRangeDisplayed(0);
    }
    setLoading(false);
  }

  function handleButtonNewClick() {
    setVisibleLayer(VISIBLE_LAYER_MEMBER_NEW);
  }

  function handleButtonSearchClick() {
    if (showSearch) {
      setSearchText("");
      setShowSearch(false);
      setPageRangeDisplayed(0);
      doFetchMemberList(
        selectedLimit,
        0,
        "",
        `${orderBy} ${orderDirection}`,
      );
    }
    setShowSearch(!showSearch);
  }

  function handleButtonImportClick() {
    setVisibleLayer(VISIBLE_LAYER_MEMBER_IMPORT);
  }

  function handleButtonExportClick() {
    setVisibleLayer(VISIBLE_LAYER_MEMBER_EXPORT);
  }

  function handleEditLinkClick(member: TMember) {
    setMemberToEdit(member);
    setVisibleLayer(VISIBLE_LAYER_MEMBER_EDIT);
  }

  function handleDeleteLinkClick(member: TMember) {
    setMemberToEdit(member);
    setDialogErrorMessage(null);
    setVisibleDialog(VISIBLE_DIALOG_DELETE);
  }

  async function handleConfirmDeleteMember() {
    setLoading(true);
    setDialogErrorMessage(null);
    if (memberToEdit) {
      const result = await deleteMember(activeSessionData.sessionId, memberToEdit);
      if (result.status === 'OK') {
        setVisibleDialog("");
        setTimeout(() => {
          handleButtonRefreshClick();
        }, 500);
      } else {
        setDialogErrorMessage(
          parseErrorMessage(translationStrings, result.errorMessage || 'unknownError')
        );
      }
    }
    setLoading(false);
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "limit") {
      const newLimit = Number(event.target.value);
      localStorage.setItem(LOCAL_STORAGE_LIMIT_KEY, String(newLimit));
      setSelectedLimit(newLimit);
      setPageRangeDisplayed(0);
      doFetchMemberList(
        newLimit,
        0,
        showSearch ? searchText : "",
        `${orderBy} ${orderDirection}`,
      );
    } else if (event.target.name === "search_text") {
      setSearchText(event.target.value);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.currentTarget.name === "search_text" && event.key === "Enter") {
      setPageRangeDisplayed(0);
      doFetchMemberList(
        selectedLimit,
        0,
        showSearch ? searchText : "",
        `${orderBy} ${orderDirection}`,
      );
    }
  }

  const handlePageClick = (event: { selected: number }) => {
    setPageRangeDisplayed(event.selected);
    const newOffset = (event.selected * selectedLimit) % totalMemberCount;
    doFetchMemberList(
      selectedLimit,
      newOffset,
      showSearch ? searchText : "",
      `${orderBy} ${orderDirection}`,
    );
  }

  function handleTableHeaderClick(ordering: string) {
    if (orderBy === ordering) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
      doFetchMemberList(
        selectedLimit,
        selectedLimit * pageRangeDisplayed,
        showSearch ? searchText : "",
        `${ordering} ${orderDirection === "asc" ? "desc" : "asc"}`,
      );
    } else {
      setOrderBy(ordering);
      doFetchMemberList(
        selectedLimit,
        selectedLimit * pageRangeDisplayed,
        showSearch ? searchText : "",
        `${ordering} ${orderDirection}`,
      );
    }
  }

  if (visibleLayer === VISIBLE_LAYER_MEMBER_IMPORT) {
    return <MemberImport
    activeSessionData={activeSessionData}
      handleGoBack={() => {
        setVisibleLayer(VISIBLE_LAYER_MEMBER);
        handleButtonRefreshClick();
      }}
    />
  }

  if (visibleLayer === VISIBLE_LAYER_MEMBER_EXPORT) {
    return <MemberExport
      activeSessionData={activeSessionData}
      handleGoBack={() => {
        setVisibleLayer(VISIBLE_LAYER_MEMBER);
        handleButtonRefreshClick();
      }}
      search={searchText}
      order={orderBy}
    />
  }

  if (visibleLayer === VISIBLE_LAYER_MEMBER_NEW) {
    return <MemberEdit
      activeSessionData={activeSessionData}
      visibleLayer={VISIBLE_LAYER_MEMBER_NEW}
      memberToEdit={null}
      handleGoBack={() => {setVisibleLayer(VISIBLE_LAYER_MEMBER);}}
      handleNewMemberAdded={(member: TMember) => {
        setVisibleLayer(VISIBLE_LAYER_MEMBER);
        setTimeout(() => {
          setMemberList([member, ...memberList]);
        }, 500);
      }}
      handleMemberUpdated={() => {}}
    />
  }

  if (visibleLayer === VISIBLE_LAYER_MEMBER_EDIT) {
    return <MemberEdit
      activeSessionData={activeSessionData}
      visibleLayer={VISIBLE_LAYER_MEMBER_EDIT}
      memberToEdit={memberToEdit}
      handleGoBack={() => {setVisibleLayer(VISIBLE_LAYER_MEMBER);}}
      handleNewMemberAdded={() => {}}
      handleMemberUpdated={() => {
        setVisibleLayer(VISIBLE_LAYER_MEMBER);
        setTimeout(() => {
          handleButtonRefreshClick();
        }, 500);
      }}
    />
  }

  function DialogDelete() {
    let dialogText = translationStrings.delete;
    if (memberToEdit) {
      dialogText = `${dialogText} ${memberToEdit.name} (${memberToEdit.regNumber})?`;
    }

    return (
      <CpDialog
        title="Delete Member"
        handleClose={() => {setVisibleDialog("");}}
      >
        <div className="flex flex-col">
          <div className="flex flex-row justify-center mb-8">
            {dialogText}
          </div>
          {dialogErrorMessage && (
            <div className="error_message_color flex flex-row justify-center mb-4">
              {dialogErrorMessage}
            </div>
          )}
          <div className="flex flex-row justify-center">
            <button
              type="button"
              className="primary me-4"
              onClick={handleConfirmDeleteMember}
            >
              {translationStrings.delete}
            </button>
            <button
              type="button"
              onClick={() => {setVisibleDialog("");}}
            >
              {translationStrings.cancel}
            </button>
          </div>
        </div>
      </CpDialog>
    );
  }

  let rowNumber = pageRangeDisplayed * selectedLimit;

  return (
    <div className="standard_content">
      <h2 className="page_title">{translationStrings.members}</h2>
      <div className="flex flex-col md:flex-row justify-between mt-4 mb-4">
        <div className="flex flex-row mb-2 md:mb-0">
          <button
            type="button"
            className="button_icon_1 me-1"
            title={translationStrings.refresh}
            onClick={handleButtonRefreshClick}
          >
            <IcRefreshIcon/>
          </button>
          <button
            type="button"
            className="button_icon_1 me-1"
            title={translationStrings.search}
            onClick={handleButtonSearchClick}
          >
            <IcSearchIcon/>
            {showSearch && (
              <IcCloseIcon/>
            )}
          </button>
          {permissions.allowedToAddNewMeber && (
            <button
              type="button"
              id="button_new"
              onClick={handleButtonNewClick}
            >
              {translationStrings.addNew}
            </button>
          )}
        </div>
        <div className="flex flex-row">

          <div className="relative inline-block text-left">
            <div>
              {permissions.allowedToImportMembers && (
                <button
                  type="button"
                  className="me-1"
                  // className="dropdown_button"
                  // id="menu-button"
                  // aria-expanded="true"
                  // aria-haspopup="true"
                  // onClick={() => {setShowImportDropdown(!showImportDropdown)}}
                  onClick={handleButtonImportClick}
                >
                  {translationStrings.import}
                  {/* <span className="material-symbols-outlined text-slate-200 dark:text-slate-800">arrow_drop_down</span> */}
                </button>
              )}
              {permissions.allowedToExportMembers && (
                <button
                  type="button"
                  onClick={handleButtonExportClick}
                >
                  {translationStrings.export}
                </button>
              )}
            </div>
            {/* {showImportDropdown && (
              <div className="dropdown_menu" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                <div className="py-1" role="none">
                  <a
                    href="#"
                    role="menuitem"
                    id="menu-item-upload"
                    onClick={() => {
                      setShowImportDropdown(false);
                      setVisiblePage(pageMemberImport);
                    }}
                    >
                    Upload Excel File
                  </a>
                  <a
                    href={`${config.api.member}/template`}
                    role="menuitem"
                    id="menu-item-download"
                    onClick={() => {setShowImportDropdown(false)}}
                  >
                    Download Sample Excel File
                  </a>
                </div>
              </div>
            )} */}
          </div>

        </div>
      </div>
      {showSearch && (
        <div className="flex flex-col mb-4">
          <div className="flex flex-row">
            <input
              name="search_text"
              type="search"
              className="w-full md:w-1/4"
              value={searchText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={translationStrings.searchRegNumberOrName}
              autoFocus
            />
          </div>
        </div>
      )}
      <div className="flex flex-col">

        <div className="inline-flex flex-col md:flex-row justify-around w-full mb-2">
          <div className="flex flex-row justify-center w-full md:w-1/4">
            <div className="inline-flex flex-row justify-center">
              <span className="m-2">{translationStrings.view}</span>
              <select name="limit" value={selectedLimit} onChange={handleChange}>
                {PAGE_LIMITS.map(limit => (<option value={limit} key={limit}>{limit}</option>))}
              </select>
              <span className="my-2 ms-2 me-1">{translationStrings.of}</span>
              <span className="my-2 mx-1">{totalMemberCount}</span>
              <span className="my-2 mx-1 lowercase">{translationStrings.members}</span>
            </div>
          </div>
          <div className="pagination inline-flex flex-row mt-2 md:mt-1 w-full md:w-2/3 justify-center md:justify-start overflow-auto">
            <ReactPaginate
              breakLabel="..."
              previousLabel="<"
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={pageRangeDisplayed}
              forcePage={pageRangeDisplayed}
              pageCount={pageCount}
              renderOnZeroPageCount={null}
            />
          </div>
        </div>

        <div className="data_table">
          <table className="data_table">
            <thead>
              <tr>
                <th scope="col" className="text-end">
                  <div className="inline-flex">
                    {translationStrings.no1}
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="ordering_header"
                    onClick={() => handleTableHeaderClick("regNumber")}
                  >
                    {translationStrings.regNumber}
                    <div className="ordering_icon flex flex-col justify-center ps-1">
                      {orderBy !== "regNumber" ? "" :
                        (orderDirection === "asc" ? <IcArrowDropUpIcon/> : <IcArrowDropDownIcon/>)}
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="ordering_header pt-1"
                    onClick={() => handleTableHeaderClick("name")}
                  >
                    <div>{translationStrings.name}</div>
                    <div className="ordering_icon flex flex-col justify-center ps-1">
                      {orderBy !== "name" ? "" :
                        (orderDirection === "asc" ?  <IcArrowDropUpIcon/> : <IcArrowDropDownIcon/>)}
                    </div>
                  </div>
                </th>
                <th scope="col"></th>
                <th scope="col" className="text-center">
                  <div className="inline-flex">
                    {translationStrings.gender}
                  </div>
                </th>
                <th scope="col">
                  <div className="inline-flex">
                    {translationStrings.address}
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="ordering_header"
                    onClick={() => handleTableHeaderClick("birthDate")}
                  >
                    {translationStrings.birthDate}
                    <div className="ordering_icon flex flex-col justify-center ps-1">
                      {orderBy !== "birthDate" ? "" :
                        (orderDirection === "asc" ?  <IcArrowDropUpIcon/> : <IcArrowDropDownIcon/>)}
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div className="inline-flex">
                    {translationStrings.phone1}
                  </div>
                </th>
                <th scope="col">
                  <div className="inline-flex">
                    {translationStrings.phone2}
                  </div>
                </th>
                <th scope="col">
                  <div
                    className="ordering_header"
                    onClick={() => handleTableHeaderClick("marriageDate")}
                  >
                    {translationStrings.marriageDate}
                    <div className="ordering_icon flex flex-col justify-center ps-1">
                      {orderBy !== "marriageDate" ? "" :
                        (orderDirection === "asc" ?  <IcArrowDropUpIcon/> : <IcArrowDropDownIcon/>)}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((element: TMember) => {
                let badgeClass = "text-xs bg-gray-600 dark:bg-slate-400 text-white dark:text-slate-800 px-1 h-4 rounded-2xl mt-1 whitespace-nowrap";
                if (element.category?.toLowerCase() === "child") {
                  badgeClass = "text-xs bg-red-700 text-white px-1 h-4 rounded-2xl mt-1 whitespace-nowrap";
                } else if (element.category?.toLowerCase() === "associate") {
                  badgeClass = "text-xs bg-blue-700 text-white px-1 h-4 rounded-2xl mt-1 whitespace-nowrap";
                }
                return (
                  <tr key={element.id}>
                    <td className="text-end">{++rowNumber}</td>
                    <td>{element.regNumber}</td>
                    <td>{element.name}</td>
                    <td className="flex-row">
                      <div className="flex flex-row h-full">
                        {permissions.allowedToEditMember && (
                          <a
                            href="#"
                            className="link_icon"
                            title={translationStrings.edit}
                            onClick={() => handleEditLinkClick(element)}
                          >
                            <IcEditIcon/>
                          </a>
                        )}
                        {permissions.allowedToDeleteMember && (
                          <a
                            href="#"
                            className="link_icon"
                            title={translationStrings.delete}
                            onClick={() => handleDeleteLinkClick(element)}
                          >
                            <IcDeleteIcon/>
                          </a>
                        )}
                        <span className={badgeClass}>{element.category}</span>
                      </div>
                    </td>
                    <td className="text-center">{element.gender}</td>
                    <td>{element.address}</td>
                    <td className="whitespace-nowrap">{dateToString(element.birthDate)}</td>
                    <td>{element.phone1}</td>
                    <td>{element.phone2}</td>
                    <td className="whitespace-nowrap">{dateToString(element.marriageDate)}</td>
                  </tr>
                );
              })}
              {memberList.length === 0 && (
                <tr>
                  <td className="sm:text-center" colSpan={10}>{translationStrings.noData}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="inline-flex flex-col md:flex-row justify-around w-full my-2">
          <div className="flex flex-row justify-center w-full md:w-1/4">
            <div className="inline-flex flex-row justify-center">
              <span className="m-2">{translationStrings.view}</span>
              <select name="limit" value={selectedLimit} onChange={handleChange}>
                {PAGE_LIMITS.map(limit => (<option value={limit} key={limit}>{limit}</option>))}
              </select>
              <span className="my-2 ms-2 me-1">{translationStrings.of}</span>
              <span className="my-2 mx-1">{totalMemberCount}</span>
              <span className="my-2 mx-1 lowercase">{translationStrings.members}</span>
            </div>
          </div>
          <div className="pagination">
            <ReactPaginate
              breakLabel="..."
              previousLabel="<"
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={pageRangeDisplayed}
              forcePage={pageRangeDisplayed}
              pageCount={pageCount}
              renderOnZeroPageCount={null}
            />
          </div>
        </div>

      </div>
      {visibleDialog === VISIBLE_DIALOG_DELETE && <DialogDelete />}
      {loading && <CpSpinner/>}
    </div>
  );
}
