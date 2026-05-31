<#import "template.ftl" as layout>

<@layout.registrationLayout displayMessage=false displayInfo=false; section>

    <#if section = "header">

        <div style="
            width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:0px;
        ">


            <img
                src="${url.resourcesPath}/rpa.jpg"
                style="
                    width:100%;
                    max-width:800px;
                    height:120px;
                    object-fit:cover;
                    object-position:center;
                    border-radius:5px;
                    display:block;
                    margin:0 auto 8px auto;
                "
            />

        </div>

    <#elseif section = "form">

        <div style="
            width:100%;
            max-width:520px;
            margin:auto;
            background:white;
            padding:36px;
            border-radius:12px;
            box-sizing:border-box;
        ">

            <form
                id="kc-form-login"
                action="${url.loginAction}"
                method="post"
            >

                <div style="margin-bottom:22px;">

                    <label
                        for="username"
                        style="
                            display:block;
                            margin-bottom:8px;
                            font-size:14px;
                            font-weight:600;
                            color:#111827;
                        "
                    >
                        Username
                    </label>

                    <input
                        tabindex="1"
                        id="username"
                        name="username"
                        type="text"
                        autofocus

                        style="
                            width:100%;
                            height:48px;
                            padding:0 14px;
                            border:1px solid #d1d5db;
                            border-radius:8px;
                            font-size:14px;
                            box-sizing:border-box;
                            outline:none;
                        "
                    />

                </div>

                <div style="margin-bottom:28px;">

                    <label
                        for="password"
                        style="
                            display:block;
                            margin-bottom:8px;
                            font-size:14px;
                            font-weight:600;
                            color:#111827;
                        "
                    >
                        Password
                    </label>

                    <input
                        tabindex="2"
                        id="password"
                        name="password"
                        type="password"

                        style="
                            width:100%;
                            height:48px;
                            padding:0 14px;
                            border:1px solid #d1d5db;
                            border-radius:8px;
                            font-size:14px;
                            box-sizing:border-box;
                            outline:none;
                        "
                    />

                </div>

                <input
                    tabindex="4"
                    name="login"
                    id="kc-login"
                    type="submit"
                    value="Sign In"

                    style="
                        width:100%;
                        height:48px;
                        border:none;
                        border-radius:8px;
                        background:#0f766e;
                        color:white;
                        font-size:14px;
                        font-weight:600;
                        cursor:pointer;
                    "
                />

            </form>

        </div>

    </#if>

</@layout.registrationLayout>