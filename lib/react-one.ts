import papi from "papi-backend";
import type { SavedWebViewDefinition,
    WebViewContentType,
    WebViewDefinition } from "shared/data/web-view.model";
import type { IWebViewProvider } from "shared/models/web-view-provider.model";
import { ExecutionActivationContext } from "extension-host/extension-types/extension-activation-context.model";

// @ts-expect-error ts(1192) this file has no default export; the text is exported by rollup
import reactOne from "./react-one.web-view";

import extensionTemplateReactStyles from "./extension-template.web-view.scss?inline";

const { logger, dataProvider: { DataProviderEngine } } = papi;

const reactOneWebViewType = "react-view-one.react";

/**
 * Simple web view provider that provides React web views when papi requests them
 */
const reactOneWebViewProvider: IWebViewProvider = {
    async getWebView(
      savedWebView: SavedWebViewDefinition
    ): Promise<WebViewDefinition | undefined> {
      if (savedWebView.webViewType !== reactOneWebViewType)
        throw new Error(
          `${reactOneWebViewType} provider received request to provide a ${savedWebView.webViewType} web view`
        );
      return {
        ...savedWebView,
        title: "React View One",
        content: reactOne,
        styles: extensionTemplateReactStyles,
      };
    },
  };
  
export async function activateReactOne(context: ExecutionActivationContext) {
    logger.info("React One is activating!");
    
    const reactOneWebViewProviderPromise = papi.webViews.registerWebViewProvider(
        reactOneWebViewType,
        reactOneWebViewProvider
      );
    
    papi.webViews.getWebView(reactOneWebViewType, undefined, { existingId: "?" });
    
    const reactOneWebViewProviderResolved = await reactOneWebViewProviderPromise;

    logger.info("React One has finished activating!");

    return reactOneWebViewProviderResolved;
}    