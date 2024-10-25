const getValueByKey = <T extends Record<string, any>>(
  obj: T,
  key: string
): any => {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default getValueByKey;
