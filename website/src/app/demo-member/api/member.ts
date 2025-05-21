import { config } from "@/app/utils/config";
import { enEN } from "@/app/translations/enEN";

const translationStrings = enEN;

export type TMember = {
  id: string,
  regNumber: string,
  name: string,
  gender: string,
  address: string | null,
  birthDate: string | null,
  phone1: string | null,
  phone2: string | null,
  marriageDate: string | null,
  category: string | null,
  createdAt: Date | null,
  updatedAt: Date | null,
  deletedAt: Date | null,
};

type TMemberImportProgressPercentResult = {
  status: string,
  progressPercent: number,
  errorMessage: string | null,
}

type TFethcMemberListResult = {
  status: string,
  totalMemberCount: number,
  pageCount: number,
  errorMessage: string | null,
  members: TMember[] | null,
}

type TMemberExportResult = {
  status: string,
  errorMessage: string | null,
  totalMemberCount: number,
  exportId: string | null,
}

type TMemberExportProgressPercentResult = {
  status: string,
  progressPercent: number,
  errorMessage: string | null,
}

type TAddNewMemberResult = {
  status: string,
  errorMessage: string | null,
  id: string | null,
}

type TUpdateMemberResult = {
  status: string,
  errorMessage: string | null,
}

type TDeleteMemberResult = {
  status: string,
  errorMessage: string | null,
}

export async function getImportProgressPercent(
  uploadId: string
) {
  const result: TMemberImportProgressPercentResult = {
    status: 'OK',
    progressPercent: 0,
    errorMessage: null,
  };

  try {
    const response = await fetch(
      `${config.api.member}/import-progress-percent/${uploadId}`,
      { method: 'GET'},
    );
    const responseJson = await response.json();

    if (response.status !== 200) {
      result.status = 'error';
      result.errorMessage = translationStrings.internalServerError;
      return result;
    }

    result.progressPercent = responseJson.data.progressPercent;
    result.status = responseJson.data.status;
  } catch (error) {
    console.error(error);
    result.status = 'error';
    result.errorMessage = translationStrings.unknownError;
  }

  return result;
}

export async function requestMemberExport(
  sessionId: string, search: string, order: string
): Promise<TMemberExportResult> {
  const result: TMemberExportResult = {
    status: 'OK',
    errorMessage: null,
    totalMemberCount: 0,
    exportId: null,
  }

  try {
    const response = await fetch(
      `${config.api.member}/export?search=${search}&order=${order}`,
      {method: 'GET', headers: { 'Authorization': `Bearer ${sessionId}` }}
    );
    const responseJson = await response.json();

    if (response.status !== 200) {
      result.status = 'error';
      result.errorMessage = responseJson.message;
      return result;
    }

    result.totalMemberCount = responseJson.totalMemberCount;
    result.exportId = responseJson.exportId;
  } catch (error) {
    console.error(error);
  }

  return result;
}

export async function getExportProgressPercent(
  exportId: string
) {
  const result: TMemberExportProgressPercentResult = {
    status: 'OK',
    progressPercent: 0,
    errorMessage: null,
  };

  try {
    const response = await fetch(
      `${config.api.member}/export-progress-percent/${exportId}`, { method: 'GET'},
    );
    const responseJson = await response.json();

    if (response.status !== 200) {
      result.status = 'error';
      result.errorMessage = translationStrings.internalServerError;
      return result;
    }

    result.progressPercent = responseJson.data.progressPercent;
    result.status = responseJson.data.status;
  } catch (error) {
    console.error(error);
    result.status = 'error';
    result.errorMessage = translationStrings.unknownError;
  }

  return result;
}

export async function fetchMemberList(
  sessionId: string,
  limit: number,
  offset: number,
  search: string,
  order: string,
) {
  if (offset < 0) {
    offset = 0;
  }

  let url = `${config.api.member}/list?limit=${limit}&offset=${offset}`;
  if (search) {
    url = `${url}&search=${search}`;
  }
  if (order) {
    url = `${url}&order=${order}`;
  }

  const result: TFethcMemberListResult = {
    status: 'OK',
    totalMemberCount: 0,
    pageCount: 0,
    errorMessage: null,
    members: null,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${sessionId}` },
    });
    const responseJson = await response.json();

    if (response.status === 400) {
      result.status = 'error';
      result.errorMessage = responseJson.message;
      return result;
    }

    if (response.status !== 200) {
      result.status = 'error';
      result.errorMessage = translationStrings.unknownError;
      return result;
    }

    const pageCount = Math.ceil(responseJson.totalMemberCount / limit);

    result.totalMemberCount = responseJson.totalMemberCount;
    result.pageCount = pageCount;
    result.members = responseJson.data;
  } catch (error) {
    console.error(error);
    result.status = 'error';
    result.errorMessage = translationStrings.unknownError;
  }

  return result;
}

export async function addNewMember(
  sessionId: string,
  member: TMember
): Promise<TAddNewMemberResult> {
  const result: TAddNewMemberResult = {
    status: 'OK',
    errorMessage: null,
    id: null,
  };

  try {
    const response = await fetch(
      config.api.member,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionId}` },
        body: JSON.stringify(member),
      }
    );
    const responseJson = await response.json();

    if (response.status !== 200) {
      result.status = 'error';
      result.errorMessage = responseJson.message;
      return result;
    }

    result.id = responseJson.id;
  } catch (error) {
    console.error(error);
    result.status = 'error';
    result.errorMessage = 'unknownError';
  }

  return result;
}

export async function updateMember(
  sessionId: string,
  member: TMember
): Promise<TUpdateMemberResult> {
  const result: TUpdateMemberResult = {
    status: 'OK',
    errorMessage: null,
  }

  try {
    const response = await fetch(
      config.api.member,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionId}` },
        body: JSON.stringify(member),
      }
    );

    const responseJson = await response.json();

    if (response.status !== 200) {
      result.status = 'error';
      result.errorMessage = responseJson.message;
      return result;
    }
  } catch (error) {
    console.error(error);
    result.status = 'error';
    result.errorMessage = 'unknownError';
  }

  return result;
}

export async function deleteMember(
  sessionId: string, member: TMember
): Promise<TDeleteMemberResult> {
  const result: TDeleteMemberResult = {
    status: 'OK',
    errorMessage: null,
  }

  try {
    const response = await fetch(
      `${config.api.member}/${member.id}`,
      {method: 'DELETE', headers: { 'Authorization': `Bearer ${sessionId}` }},
    );

    const responseJson = await response.json();

    if (response.status !== 200) {
      result.status = 'error';
      result.errorMessage = responseJson.message;
      return result;
    }
  } catch (error) {
    console.error(error);
    result.status = 'error';
    result.errorMessage = 'unknownError';
  }

  return result;
}

export async function getMemberCount(sessionId: string): Promise<number> {
  let count = 0;

  try {
    const response = await fetch(
      `${config.api.member}/count`,
      {method: 'GET', headers: { 'Authorization': `Bearer ${sessionId}` }},
    );

    const responseJson = await response.json();

    if (response.status === 200) {
      count = Number.parseInt(responseJson.count, 10);
    }
  } catch (error) {
    console.error(error);
  }

  return count;
}

export async function prepareSampleData(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${config.api.member}/prepare-sample`,
      {method: 'GET', headers: { 'Authorization': `Bearer ${sessionId}` }},
    );

    if (response.status !== 200) {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}
