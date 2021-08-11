<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="POS.Reports.WebForm1" %>

<%@ Register Assembly="Telerik.ReportViewer.WebForms, Version=7.2.13.1016, Culture=neutral, PublicKeyToken=a9d7983dfcc261be" Namespace="Telerik.ReportViewer.WebForms" TagPrefix="telerik" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
       <telerik:ReportViewer ID="ReportViewer1" runat="server" Width="100%" Height="1000px" ViewMode="PrintPreview"></telerik:ReportViewer>

    </div>
        <script type="text/javascript">
            ReportViewer.prototype.PrintReport = function () {
                switch (this.defaultPrintFormat) {
                    case "Default":
                        this.DefaultPrint();
                        break;
                    case "PDF":
                        this.PrintAs("PDF");
                        previewFrame = document.getElementById(this.previewFrameID);
                        previewFrame.onload = function () { previewFrame.contentDocument.execCommand("print", true, null); }
                        break;
                }
            };


            <%=ReportViewer1.ClientID %>.PrintReport(); 


</script>
    </form>
</body>
</html>
