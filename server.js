{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const axios = require('axios');\
const app = express();\
app.use(express.json());\
\
app.post('/api/jotform-webhook', async (req, res) => \{\
    try \{\
        const jotformData = req.body;\
\
        // Map JotForm fields to CareGLP format\
        const patientData = \{\
            first_name: jotformData.answers["1"].answer,\
            last_name: jotformData.answers["2"].answer,\
            email: jotformData.answers["3"].answer,\
            phone: jotformData.answers["4"].answer,\
            provider_id: process.env.PROVIDER_ID,\
            case_type: "new"\
        \};\
\
        // Send to CareGLP API\
        const careGLPResponse = await axios.post(\
            'https://api.careglp.com/patient-case',\
            patientData,\
            \{\
                headers: \{\
                    'Content-Type': 'application/json',\
                    'Authorization': `Bearer $\{process.env.CAREGLP_API_KEY\}`\
                \}\
            \}\
        );\
\
        res.json(\{ success: true, careGLPResponse: careGLPResponse.data \});\
    \} catch (error) \{\
        console.error("Error sending data to CareGLP:", error);\
        res.status(500).json(\{ success: false, error: error.message \});\
    \}\
\});\
\
app.listen(3000, () => console.log('Server running on port 3000'));\
}