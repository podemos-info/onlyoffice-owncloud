/**
 *
 * (c) Copyright Ascensio System SIA 2019
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms of the GNU Affero General Public License
 * (AGPL) version 3 as published by the Free Software Foundation.
 * In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * For details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 17-2 Elijas street, Riga, Latvia, EU, LV-1021.
 *
 * The interactive user interfaces in modified source and object code versions of the Program
 * must display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when distributing the program.
 * Pursuant to Section 7(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical
 * writing content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0 International.
 * See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

(function ($, OC) {

    $(document).ready(function () {
        OCA.Onlyoffice = _.extend({}, OCA.Onlyoffice);
        if (!OCA.Onlyoffice.AppName) {
            OCA.Onlyoffice = {
                AppName: "onlyoffice"
            };
        }

        var advToogle = function () {
            $("#onlyofficeSecretPanel").toggleClass("onlyoffice-hide");
            $("#onlyofficeAdv .icon").toggleClass("icon-triangle-s icon-triangle-n");
        };

	// comprobar primero que el id onlyofficeInternalUrl existe en el doom ya que en la version 16 de nextcloud falla al no existir dicho id
        if (typeof $("#onlyofficeInternalUrl").val() !== 'undefined'){
	    if ($("#onlyofficeInternalUrl").val().length
                || $("#onlyofficeStorageUrl").val().length) {
                advToogle();
            }
        }

        $("#onlyofficeAdv").click(function () {
            advToogle();
        });

        $("#onlyofficeGroups").prop("checked", $("#onlyofficeLimitGroups").val() != "");

        var groupListToggle = function() {
            if ($("#onlyofficeGroups").prop("checked")) {
                OC.Settings.setupGroupsSelect($("#onlyofficeLimitGroups"));
            } else {
                $("#onlyofficeLimitGroups").select2("destroy");
            }
        };

        $("#onlyofficeGroups").click(groupListToggle);
        groupListToggle();


        $("#onlyofficeAddrSave").click(function () {
            $(".section-onlyoffice").addClass("icon-loading");
            var onlyofficeUrl = $("#onlyofficeUrl").val().trim();

            if (!onlyofficeUrl.length) {
                $("#onlyofficeInternalUrl, #onlyofficeStorageUrl, #onlyofficeSecret").val("");
            }

            var onlyofficeInternalUrl = ($("#onlyofficeInternalUrl:visible").val() || "").trim();
            var onlyofficeStorageUrl = ($("#onlyofficeStorageUrl:visible").val() || "").trim();
            var onlyofficeSecret = $("#onlyofficeSecret:visible").val() || "";

            $.ajax({
                method: "PUT",
                url: OC.generateUrl("apps/" + OCA.Onlyoffice.AppName + "/ajax/settings/address"),
                data: {
                    documentserver: onlyofficeUrl,
                    documentserverInternal: onlyofficeInternalUrl,
                    storageUrl: onlyofficeStorageUrl,
                    secret: onlyofficeSecret
                },
                success: function onSuccess(response) {
                    $(".section-onlyoffice").removeClass("icon-loading");
                    if (response && response.documentserver != null) {
                        $("#onlyofficeUrl").val(response.documentserver);
                        $("#onlyofficeInternalUrl").val(response.documentserverInternal);
                        $("#onlyofficeStorageUrl").val(response.storageUrl);
                        $("#onlyofficeSecret").val(response.secret);

                        $(".section-onlyoffice-2").toggleClass("onlyoffice-hide", !response.documentserver.length || !!response.error.length);

                        var message =
                            response.error
                                ? (t(OCA.Onlyoffice.AppName, "Error when trying to connect") + " (" + response.error + ")")
                                : t(OCA.Onlyoffice.AppName, "Settings have been successfully updated");
                        OC.Notification.show(message, {
                            type: response.error ? "error" : null,
                            timeout: 3
                        });
                    }
                }
            });
        });

        $("#onlyofficeSave").click(function () {
            $(".section-onlyoffice").addClass("icon-loading");

            var defFormats = {};
            $("input[id^=\"onlyofficeDefFormat\"]").each(function() {
                defFormats[this.name] = this.checked;
            });

            var editFormats = {};
            $("input[id^=\"onlyofficeEditFormat\"]").each(function() {
                editFormats[this.name] = this.checked;
            });

            var sameTab = $("#onlyofficeSameTab").is(":checked");

            var limitGroupsString = $("#onlyofficeGroups").prop("checked") ? $("#onlyofficeLimitGroups").val() : "";
            var limitGroups = limitGroupsString ? limitGroupsString.split("|") : [];

            var chat = $("#onlyofficeChat").is(":checked");
            var compactHeader = $("#onlyofficeCompactHeader").is(":checked");
            var feedback = $("#onlyofficeFeedback").is(":checked");
            var help = $("#onlyofficeHelp").is(":checked");
            var toolbarNoTabs = !$("#onlyofficeToolbarNoTabs").is(":checked");

            $.ajax({
                method: "PUT",
                url: OC.generateUrl("apps/" + OCA.Onlyoffice.AppName + "/ajax/settings/common"),
                data: {
                    defFormats: defFormats,
                    editFormats: editFormats,
                    sameTab: sameTab,
                    limitGroups: limitGroups,
                    chat: chat,
                    compactHeader: compactHeader,
                    feedback: feedback,
                    help: help,
                    toolbarNoTabs: toolbarNoTabs
                },
                success: function onSuccess(response) {
                    $(".section-onlyoffice").removeClass("icon-loading");
                    if (response) {
                        var message = t(OCA.Onlyoffice.AppName, "Settings have been successfully updated");
                        OC.Notification.show(message, {
                            timeout: 3
                        });
                    }
                }
            });
        });

        $(".section-onlyoffice input").keypress(function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                $("#onlyofficeAddrSave").click();
            }
        });
    });

})(jQuery, OC);
