import re
import time
import json

# Generate the data file from the response using the following fart commands
# fart --c-style miami_half_data.txt ],[ "\n"
# fart --c-style --remove miami_half_data.txt [
# fart --c-style --remove miami_half_data.txt ]
# fart --c-style miami_half_data.txt \",\" "\t"
# fart --c-style --remove miami_half_data.txt \"


#### ------------------------------------------ ####


def InSeconds(t):
    return t[3]*3600 + t[4]*60 + t[5]


def DecodeUSCity(homeCityStr):
    resultDict = {}

    words = re.split('\W+', homeCityStr)

    for word in words:
        if len(word) != 2:
            continue
        if word in alphaCodeDict.keys():
            resultDict = alphaCodeDict[word]
            break;

    if len(resultDict) == 0:
        resultDict = 'None'

    return resultDict


#### ------------------------------------------ ####


stateCodesFilename = "Data/state_codes.json"
stateCodes = []
with open(stateCodesFilename) as file:
    stateCodes = json.load(file)

alphaCodeDict = {}
for code in stateCodes:
    alphaCodeDict[code['alpha-code']] = code

dataArray = []
inputDataFilename = "Data/miami_half_data.txt"
with open(inputDataFilename) as f:
    for line in f:
        values = re.split(r'\t', line)

        participant = {}
        participant["id"] = values[0]
        participant["rank"] = int(values[1])
        participant["name"] = values[2]
        participant["bib-number"] = int(values[3])

        t = time.strptime(values[4], "%H:%M:%S")
        participant["time"] = InSeconds(t)

        t = time.strptime(values[5], "%M:%S")
        participant["pace"] = InSeconds(t)

        homeCity = values[6]
        participant["home-city"] = DecodeUSCity(homeCity)
        participant["age"] = int(values[7])
        participant["sex"] = values[8]

        dataArray.append(participant)


# Save processed data
outputDataFilename = inputDataFilename[0:-4] + ".json"
with open(outputDataFilename, 'w') as outfile:
    json.dump(dataArray, outfile)
