import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
} from "docx";

/** Lines match the Emergency Blood Request paper form layout. */
function templateParagraphs() {
  return [
    new Paragraph({
      text: "Emergency Blood Request",
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph(""),
    new Paragraph("Hospital Name: ________"),
    new Paragraph(""),
    new Paragraph("City: ___________"),
    new Paragraph(""),
    new Paragraph("Blood Type Needed: _______"),
    new Paragraph(""),
    new Paragraph("Units Required: ________"),
    new Paragraph(""),
    new Paragraph("Urgency Level:"),
    new Paragraph("[ ] High"),
    new Paragraph("[ ] Medium"),
    new Paragraph("[ ] Low"),
    new Paragraph(""),
    new Paragraph("Patient Condition:"),
    new Paragraph("_____________"),
    new Paragraph(""),
    new Paragraph("Time Needed:"),
    new Paragraph("_____________"),
    new Paragraph(""),
    new Paragraph("Donor Type Needed:"),
    new Paragraph("_____________"),
    new Paragraph(""),
    new Paragraph("Contact Number:"),
    new Paragraph("_____________"),
    new Paragraph(""),
    new Paragraph("Additional Notes:"),
    new Paragraph("_____________"),
    new Paragraph("_____________"),
    new Paragraph("_____________"),
    new Paragraph(""),
    new Paragraph("Request Type:"),
    new Paragraph("Blood Request"),
  ];
}

export async function buildEmergencyBloodRequestTemplateBuffer() {
  const doc = new Document({
    sections: [
      {
        children: templateParagraphs(),
      },
    ],
  });
  return Packer.toBuffer(doc);
}
