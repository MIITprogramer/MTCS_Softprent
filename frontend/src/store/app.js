// Utilities
import { defineStore } from 'pinia'
import $ from "jquery";
import Swal from "sweetalert2";

export const useAppStore = defineStore('app', {
  persist: {
    pick: ['sessionId']
  },
  state: () => ({
    //
    sessionId: "",
    preload: false,
    apiserver: `${import.meta.env.VITE_API_SERVER}:${import.meta.env.VITE_API_PORT}/`,
    alert: Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: {
        container: "swal-custom-zindex", // Class kustom untuk elemen swal
      },
    }),
  }),
  actions: {
    togglePreload() {
      setTimeout(() => {
        this.preload = false
      }, 1000);
    },
    ajax(data, url, methode) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: methode,
          url: this.apiserver + url,
          data: data,
          dataType: "JSON",
          success: function (response) {
            resolve(response)
          },
          error: (error) => {
            reject(error.responseJSON);
          }
        });
      })
    }
  }
})
