import { twMerge } from "tailwind-merge";

export const clsAnchor = "text-primary-700 font-medium hover:underline";

export const clsBtnBase =
  "text-center font-medium focus:ring-2 focus:outline-none inline-flex items-center justify-center text-sm border rounded-lg px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-50";

export const clsBtn = twMerge(
  clsBtnBase,
  "text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:text-primary-700 focus:ring-gray-200"
);

export const clsBtnTextWhite = twMerge(
  clsBtnBase,
  "text-white hover:text-white focus:text-white"
);

export const clsBtnActive = twMerge(
  clsBtnBase,
  clsBtnTextWhite,
  "bg-teal-600 border-teal-600 hover:bg-teal-700 focus:ring-teal-100"
);

export const clsBtnPrimary = twMerge(
  clsBtnBase,
  "text-white bg-primary-700 border-primary-700 hover:bg-primary-800 hover:text-white focus:ring-primary-300 focus:text-white"
);

export const clsBtnError = twMerge(
  clsBtnBase,
  "text-white bg-red-700 border-red-700 hover:bg-red-800 focus:ring-red-300 focus:text-white"
);

export const clsBtnBasicRed = twMerge(
  clsBtnBase,
  "text-red-600 bg-white focus:bg-red-600 hover:bg-red-600 hover:text-white focus:text-white focus:ring-red-300"
);

export const clsCheckboxBase =
  "w-4 h-4 bg-gray-100 border border-gray-300 focus:ring-2 rounded";

export const clsCheckbox = twMerge(
  clsCheckboxBase,
  "text-teal-600 cursor-pointer focus:ring-teal-500 disabled:cursor-not-allowed disabled:text-gray-400 disabled:text-gray-300"
);

export const clsDropdown =
  "bg-white text-gray-700 rounded-lg border-gray-100 divide-gray-100 shadow-md divide-y z-50 overflow-hidden";
export const clsDropdownLi = "";
export const clsDropdownLiBtn =
  "font-medium py-2 px-4 text-sm hover:bg-gray-100 block w-full text-left";

export const clsEllipsis = "text-ellipsis whitespace-nowrap overflow-hidden";

export const clsInput =
  "block border w-full p-2.5 disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary-700 focus:outline-primary-700 bg-gray-50 text-gray-900 border-gray-300 text-base rounded-lg";

export const clsInputError =
  "focus:border-red-500 focus:outline-red-500 bg-red-50 text-red-900 placeholder-red-700 border-red-500";

export function clsInputMaybeError(isError, ...restClasses) {
  return twMerge(clsInput, isError && clsInputError, ...restClasses);
}

export const clsLabel = "text-sm font-medium block";

export const clsHeaderXSmall = "text-base font-medium mb-1";

export const clsHeaderSmall = "text-lg font-medium mb-2";

export const clsHeaderMedium = "text-xl font-medium mb-3";

export const clsHeaderLarge = "text-2xl font-medium mb-4";

export const clsHeaderPrimary = "text-4xl font-bold mb-4 text-primary-700";

export const clsMessageBase = "rounded-lg px-3 py-2 text-sm font-normal border";

export const clsMessage = twMerge(
  clsMessageBase,
  "bg-gray-100 text-gray-800 border-gray-300"
);

export const clsMessageInfo = twMerge(
  clsMessageBase,
  "bg-sky-50 text-sky-700 border-sky-200"
);

export const clsMessageError = twMerge(
  clsMessageBase,
  "bg-red-100 text-red-800 border-red-300"
);

export const clsMessageSuccess = twMerge(
  clsMessageBase,
  "bg-green-100 text-green-800 border-green-300"
);

export const clsMessageWarning = twMerge(
  clsMessageBase,
  "bg-amber-100 text-amber-800 border-amber-300"
);
