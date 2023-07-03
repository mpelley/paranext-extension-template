import papi from "papi-backend";
import type { SavedWebViewDefinition,
    WebViewContentType,
    WebViewDefinition } from "shared/data/web-view.model";
import type { IWebViewProvider } from "shared/models/web-view-provider.model";
import { ExecutionActivationContext } from "extension-host/extension-types/extension-activation-context.model";

// @ts-expect-error ts(1192) this file has no default export; the text is exported by rollup
import reactTwo from "./react-two.web-view";

import extensionTemplateReactStyles from "./extension-template.web-view.scss?inline";

const { logger, dataProvider: { DataProviderEngine } } = papi;

const reactTwoWebViewType = "react-view-two.react";

/**
 * Simple web view provider that provides React web views when papi requests them
 */
const reactTwoWebViewProvider: IWebViewProvider = {
    async getWebView(
      savedWebView: SavedWebViewDefinition
    ): Promise<WebViewDefinition | undefined> {
      if (savedWebView.webViewType !== reactTwoWebViewType)
        throw new Error(
          `${reactTwoWebViewType} provider received request to provide a ${savedWebView.webViewType} web view`
        );
      return {
        ...savedWebView,
        title: "React View Two",
        content: reactTwo,
        styles: extensionTemplateReactStyles,
      };
    },
  };
  
export async function activateReactTwo(context: ExecutionActivationContext) {
    logger.info("React Two is activating!");

    const reactTwoWebViewProviderPromise = papi.webViews.registerWebViewProvider(
        reactTwoWebViewType,
        reactTwoWebViewProvider
      );
    
    papi.webViews.getWebView(reactTwoWebViewType, undefined, { existingId: "?" });
    
    const reactTwoWebViewProviderResolved = await reactTwoWebViewProviderPromise;

    logger.info("React Two has finished activating!");

    return reactTwoWebViewProviderResolved;
}    